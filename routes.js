const csv = require('csvtojson');
const csvFilePath = './Stations.csv';

const routes = {}, routeObj = {};

csv()
.fromFile(csvFilePath)
.then(json => {
  json.forEach(stop => {
    stop['Daytime Routes'].split(' ').forEach(line => {
      routes[line] = routes[line] || [];
      routes[line].push(stop['GTFS Stop ID']);
      routeObj[line] = routeObj[line] || {};
      routeObj[line][stop['GTFS Stop ID']] = stop;
    })
  })
  // console.log(routes);     <------ both are populated at this point
  // console.log(routeObj);   <------ 
})

console.log(routes, routeObj); // <---------- outputs {}, {}

module.exports = {routes, routeObj};


/* MISC TESTING */
// var checkSum = ['G21', 'F09', 'F11', 'F12', 'D14', 'A25', 'A27', 'A28', 'A30', 'A31', 'A32', 'A33', 'A34', 'E01'];
// console.log(routes.E.length, checkSum.length);
// console.log(routes.E.every(x => checkSum.includes(x)));
// console.log(checkSum.every(x => routes.E.includes(x)));