var GooglePlaces = require('./index');
var places = new GooglePlaces('AIzaSyCRo-neSC2GZQWWJ4Hy_aDfyTTiL0wKPts');

// places.nearbySearch({ location: '40.7562050,-73.9899140', 'radius': 500 }).then(function(data){
//   console.log(data);
// })
// .catch(function(err){
//   console.log('caught error');
//   console.error(err); //[Error: radius cannot be used when rankby=distance]
// });

// places.details('ChIJx97RSlNYwokRUXP8Ihf0P_M').then(function(data){
//   console.log(data);
// });

places.autoComplete({ input: 'Schnip'}).then(function(data){
  console.log(data);
});