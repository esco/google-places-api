var GooglePlaces = require('../index');
var API_KEY = 'test-key';
var nock = require('nock');
var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var fixtures = {};

fixtures.nearbysearch = require('./fixtures/nearbysearch.json');

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('places', function () {

  var places;
  var sandbox = sinon.sandbox.create();

  beforeEach(function(){
    places = new GooglePlaces(API_KEY);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('.nearbySearch', function () {

    beforeEach(function() {
      sandbox.stub(places, 'request');
    });

    it('should pass "nearbysearch" to request', function(){
      var params = { location: '40.7562050,-73.9899140' };
      places.nearbySearch(params)
      places.request.should.have.been.calledWith('nearbysearch', params);
    });

    it('should require location', function(){
      var params = { rankby: 'distance', types: 'restaurant|food|cafe' };
      places.nearbySearch(params).should.be.rejectedWith(/`location` is required/);
    });

    it('rankby should default to "prominence"', function(){
      var params = { location: '40.7562050,-73.9899140' };
      places.nearbySearch(params).then(function(){
        places.request.getCall(0).args[1].rankby.should.equal('prominence');
      })
    });

    it('should require types|name|keyword if rankby=distance', function(){
      var params = { location: '40.7562050,-73.9899140', rankby: 'distance' };

      places.nearbySearch(params).should.be.rejectedWith(/`keyword`, `types`, or `name` must be specified when using rankby=distance/);
    });

    it('should not allow `radius` when `rankby=distance`', function(){
      var params = { location: '40.7562050,-73.9899140', rankby: 'distance', radius: 50 };

      places.nearbySearch(params).should.be.rejectedWith(/`radius` cannot be used when rankby=distance/);
    })

    it('should require `minprice` to be within 0,4 inclusive', function(){
      var params = { location: '40.7562050,-73.9899140' };

      for(var i = -1; i < 6; i++) {
        params.minprice = i;
        if (i < 0 || i >4) {
          places.nearbySearch(params).should.be.rejectedWith(/`minprice` must be >= 0 or <= 4/);
        } else {
          places.nearbySearch(params).should.be.fulfilled;
        }
      }
    });

    it('should require `maxprice` to be within 0,4 inclusive', function(){
      var params = { location: '40.7562050,-73.9899140' };
      var fn;

      for(var i = -1; i < 6; i++) {
        params.maxprice = i;
        if (i < 0 || i >4) {
          places.nearbySearch(params).should.be.rejectedWith(/`maxprice` must be >= 0 or <= 4/);
        } else {
          places.nearbySearch(params).should.be.fulfilled;
        }
      }
    });
  });

  describe('.request', function () {

    it('should build url with `params`', function(){
      nock('https://maps.googleapis.com')
        .get('/maps/api/place/nearbysearch/json?location=40.7562050%2C-73.9899140&rankby=distance&types=restaurant%7Cfood%7Ccafe&key=AIzaSyCRo-neSC2GZQWWJ4Hy_aDfyTTiL0wKPts')
        .reply(200, fixtures.nearbysearch);

      var params = {
        location: '40.7562050,-73.9899140',
        rankby: 'distance',
        types: 'restaurant|food|cafe'
      };

      places.request('nearbysearch', params);
    });

    it('should use `format`', function(){
      nock('https://maps.googleapis.com')
        .get('/maps/api/place/nearbysearch/xml?location=40.7562050%2C-73.9899140&rankby=distance&types=restaurant%7Cfood%7Ccafe&key=AIzaSyCRo-neSC2GZQWWJ4Hy_aDfyTTiL0wKPts')
        .reply(200, fixtures.nearbysearch);

      var params = {
        location: '40.7562050,-73.9899140',
        rankby: 'distance',
        types: 'restaurant|food|cafe'
      };

      var places = new GooglePlaces(API_KEY, 'xml');
      places.request('nearbysearch', params);
    });
  });

  describe('.details', function () {
    var placeId = 'ChIJx97RSlNYwokRUXP8Ihf0P_M' // Schnippers

    beforeEach(function() {
      sandbox.stub(places, 'request');
    });

    it('should require `placeId`', function(){
      places.details().should.be.rejectedWith('`placeId` is required');
    });

    it('should pass "details" to request', function(){
      places.details(placeId);
      places.request.should.have.been.calledWith('details', { placeid: placeId });
    });
  });

  describe('.autoComplete', function () {

    beforeEach(function() {
      sandbox.stub(places, 'request');
    });

    it('should require `input`', function(){
      places.autoComplete({}).should.be.rejectedWith('`input` is required');
    });

    it('should pass "autocomplete" to request', function(){
      var input = 'Schnip';
      places.autoComplete({ input: input });
      places.request.should.have.been.calledWith('autocomplete', { input: input });
    });

  });

});