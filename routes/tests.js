const csv = require('csvtojson');
const csvFilePath = './routes/Stations.csv';
const routes = require('./routes');
const routesFull = require('./routesFull');

//csv()
//  .fromFile(csvFilePath)
//  .then(json => {
//    const routeObj = {};
//    json.forEach(stop => {
//      routeObj[stop['GTFS Stop ID']] = stop;
//    });
//    return routeObj;
//  }).then(stations => {
//for (var routeId in routes) {
//  if (routeId != "E") continue;
//  console.log(routeId + ":");
//  routes[routeId].stops.forEach(stopId => {
//    console.log(routeId + " " + stopId);
//    console.log(stations[stopId]["Stop Name"]);
//  });
//}
//})

for (var routeId in routes) {
  if (routeId != 'E') continue;
  var route = routes[routeId];
  console.log(routeId + ":");
  route.orderedStops.forEach((stopId) => {
    console.log(stopId);
    console.log(route[stopId]['Stop Name']);
  });
}
