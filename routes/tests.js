const csv = require('csvtojson');
const csvFilePath = './routes/Stations.csv';
const routes = require('./routes');
const routesFull = require('./routesFull');

for (var routeId in routes) {
  var route = routes[routeId];
  console.log(routeId + ":");
  route.orderedStops.forEach((stopId) => {
    console.log(stopId);
    console.log(route[stopId]['Stop Name']);
  });
}
