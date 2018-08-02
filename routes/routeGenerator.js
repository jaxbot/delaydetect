const csv = require('csvtojson');
const csvFilePath = './routes/Stations.csv';
const stopTimesCsvFilePath = './routes/StopTimes.csv';
const tripsCsvFilePath = './routes/Trips.csv';
const fs = require("fs");
const filepath = './routes/routes.json';
const filepath2 = './routes/routesFull.json';

var stopsJson = [];
var tripsByTripId = {};

function getTripsFromCsv() {
  return csv()
    .fromFile(tripsCsvFilePath)
    .then(trips => {
      trips.forEach((trip) => {
        tripsByTripId[trip['trip_id']] = trip;
      });
    });
}

function getRouteStopIds(fullRoutes) {
  return csv()
  .fromFile(stopTimesCsvFilePath)
  .then(stopTimes => {
    for (var key in fullRoutes) {
      var fullRoute = fullRoutes[key];
      var orderedStops = [];
      for (var stopId in fullRoute) {
        orderedStops.push(stopId);
      }
      fullRoute.orderedStops = orderedStops;

      // Sort the stop ids by the order we see them in a trip.

      // Build a list of trips for our route.
      var trips = {};
      stopTimes.forEach(stopTime => {
        var tripDefinition = tripsByTripId[stopTime['trip_id']];
        var routeLetter = tripDefinition['route_id'];
        if (routeLetter != key) return;

        // Only consider weekday routes since weekends are often customized for construction.
        //if (stopTime['trip_id'].indexOf("-Weekday-") !== -1) {
          if (!trips[stopTime['trip_id']]) {
            trips[stopTime['trip_id']] = {};
          }

          var stopIdWithDirection = stopTime['stop_id'];
          var bareStopId = stopIdWithDirection.substring(0, stopIdWithDirection.length - 1);
          trips[stopTime['trip_id']][bareStopId] = stopTime;
        //}
      });

      // Find a trip with every daytime stop in it.
      var completeTrip = null;
      var foundStops = {};
      for (var tripId in trips) {
        var satisfied = true;
        fullRoute.orderedStops.forEach((stopId) => {
          if (!trips[tripId][stopId]) {
            satisfied = false;
          } else {
            foundStops[stopId] = true;
          }
        });

        if (satisfied) {
          completeTrip = trips[tripId];
          break;
        }
      }

      // Sort the stops in the order they occur in this trip
      if (completeTrip) {
        fullRoute.orderedStops.sort((a, b) => {
          return completeTrip[a]['stop_sequence'] - completeTrip[b]['stop_sequence'];
        });
      } else {
        console.log("NO COMPLETE TRIP FOR " + key);
        fullRoute.orderedStops.forEach((stopId) => {
          if (!foundStops[stopId]) {
            console.log("No trip found for " + stopId + " (" + getNameFromStopId(stopId) + ")");
          }
        });
      }
    }
    return fullRoutes;
  })
  .then(routes => {
    fs.writeFile(filepath, JSON.stringify(routes, null, 5), (err) => {
      if (err) {
          console.error(err);
          return;
      };
      console.log("File has been created");
    });
  })
}

function getRouteStopsFullInfo() {
  return csv()
  .fromFile(csvFilePath)
  .then(json => {
    stopsJson = json;
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
    return routes;
  })
}


getTripsFromCsv().then(() => {
  getRouteStopsFullInfo().then((routes) => {
    getRouteStopIds(routes);
  });
});

function getNameFromStopId(stopId) {
  var retval = null;
  stopsJson.forEach(stop => {
    if (stop['GTFS Stop ID'] == stopId) {
      retval = stop['Stop Name'];
    }
  });

  return retval;
}


module.exports = {getRouteStopIds, getRouteStopsFullInfo};


/* MISC TESTING */
// var checkSum = ['G21', 'F09', 'F11', 'F12', 'D14', 'A25', 'A27', 'A28', 'A30', 'A31', 'A32', 'A33', 'A34', 'E01'];
// console.log(routes.E.length, checkSum.length);
// console.log(routes.E.every(x => checkSum.includes(x)));
// console.log(checkSum.every(x => routes.E.includes(x)));
