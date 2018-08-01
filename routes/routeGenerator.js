const csv = require('csvtojson');
const csvFilePath = './routes/Stations.csv';
const fs = require("fs");
const filepath = './routes/routes.json';
const filepath2 = './routes/routesFull.json';

function getRouteStopIds() {
  return csv()
  .fromFile(csvFilePath)
  .then(json => {
    const routes = {};
    json.forEach(stop => {
      stop['Daytime Routes'].split(' ').forEach(line => {
        routes[line] = routes[line] || [];
        routes[line].push(stop['GTFS Stop ID']);
      })
    });
    return routes;
  })
  .then(routes => {
    fs.writeFile(filepath, JSON.stringify(routes), (err) => {
      if (err) {
          console.error(err);
          return;
      };
      console.log("File has been created");
    });
  })
}

function getRouteStopsFullInfo() {
  csv()
  .fromFile(csvFilePath)
  .then(json => {
    const routeObj = {};
    json.forEach(stop => {
      stop['Daytime Routes'].split(' ').forEach(line => {
        routeObj[line] = routeObj[line] || {};
        routeObj[line][stop['GTFS Stop ID']] = stop;
      })
    });
    return routeObj;
  })
  .then(routes => {
    fs.writeFile(filepath2, JSON.stringify(routes), (err) => {
      if (err) {
          console.error(err);
          return;
      };
      console.log("File has been created");
    });
  })
}


getRouteStopIds();
getRouteStopsFullInfo();


module.exports = {getRouteStopIds, getRouteStopsFullInfo};


/* MISC TESTING */
// var checkSum = ['G21', 'F09', 'F11', 'F12', 'D14', 'A25', 'A27', 'A28', 'A30', 'A31', 'A32', 'A33', 'A34', 'E01'];
// console.log(routes.E.length, checkSum.length);
// console.log(routes.E.every(x => checkSum.includes(x)));
// console.log(checkSum.every(x => routes.E.includes(x)));