var Promise = require('bluebird');
var request = require('request-promise');

function Places(key, format) {
  this.key = key;
  this._uriOptions = {
    protocol: 'https',
    host: 'maps.googleapis.com',
    path: 'maps/api/place',
    format: format || 'json'
  };
}

Places.prototype.text = function(params) {
  if (!params.query) {
    throw new Error();
  }
}

Places.prototype.nearbySearch = function(params) {
  return Promise.try(function(){
    params.rankby = params.rankby || 'prominence';

    if (!params.location) {
      throw new Error('`location` is required');
    }

    if (params.minprice && (params.minprice < 0 || params.minprice >4)) {
      throw new Error('`minprice` must be >= 0 or <= 4');
    }

    if (params.maxprice && (params.maxprice < 0 || params.maxprice >4)) {
      throw new Error('`maxprice` must be >= 0 or <= 4');
    }

    if (params.rankby === 'distance' && params.radius) {
      throw new Error('`radius` cannot be used when rankby=distance');
    }

    if (params.rankby === 'distance' && !(params.keyword || params.types || params.name)) {
      throw new Error('`keyword`, `types`, or `name` must be specified when using rankby=distance');
    }
    return this.request('nearbysearch', params);
  }.bind(this));
}

Places.prototype.details = function(placeId) {
  return Promise.try(function(){
    if (!placeId) {
      throw new Error('`placeId` is required');
    }

    return this.request('details', { placeid: placeId });
  }.bind(this));
}

Places.prototype.autoComplete = function(params) {
  return Promise.try(function(){
    if(!params.input) {
      throw new Error('`input` is required');
    }

    return this.request('autocomplete', params);
  }.bind(this));
}

Places.prototype.request = function(api, params) {
  var uri = this._uriOptions.protocol + '://' + this._uriOptions.host + '/' + this._uriOptions.path + '/' + api + '/' + this._uriOptions.format;
  var options = { uri: uri, qs: params };
  params.key = this.key;
  return request(options);
}

module.exports = Places;