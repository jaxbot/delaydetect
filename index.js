var Mta = require('mta-gtfs');
var mta = new Mta({
  key: require("./config")['key'], // only needed for mta.schedule() method
  feed_id: 26                  // optional, default = 1
});

const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

var stopArrivals = {};
var stopArrivalLastId = {};
var stopArrivalsLastAverage = {};
var DELAY_IN_SECONDS_THRESHOLD = 90;

console.log(require("./config")['key']);

mta.stop().then(function (allStops) {
  //console.log(allStops);
  function trackTrains() {
    mta.schedule('A31', 26).then(function (result) {
      //console.log(JSON.stringify(result, null, 5));
      for (var stop in result.schedule) {
        if (!allStops[stop]) {
          //console.log("Unknown stop " + stop);
          return;
        }
        var stopName = allStops[stop].stop_name;
        for (var direction in result.schedule[stop]) {
          result.schedule[stop][direction].forEach(function(arrivingTrain) {
            var stopId = stop + direction;
            var time = (arrivingTrain.arrivalTime - result.updatedOn) / 60;
            /*if (arrivingTrain.routeId == "E") {
              console.log("'" + stop + "', // " + stopName);
            }*/
            if (stopArrivalLastId[stopId] == arrivingTrain.trainId) {
              console.log("Train still at " + stopName + " " + arrivingTrain.trainId);
              return;
            }
            if (time < 1 && time > 0) {
              console.log((direction == "N" ? "Uptown" : "Downtown") + " " + arrivingTrain.routeId + " arrived " + time + " " + stopName + " trainid " + arrivingTrain.trainId);
              stopArrivalLastId[stopId] = arrivingTrain.trainId;
              if (!stopArrivals[stopId]) {
                stopArrivals[stopId] = [];
              }
              stopArrivals[stopId].unshift(result.updatedOn);

              if (stopArrivals[stopId].length > 1) {
                console.log("Arrival time: " + (stopArrivals[stopId][0] - stopArrivals[stopId][1]) + " seconds");

                var avg = 0;
                var count = 0;
                for (var i = 0; i < stopArrivals[stopId].length - 1 && i < 6; i++) {
                  avg += stopArrivals[stopId][i] - stopArrivals[stopId][i + 1];
                  count++;
                }
                avg = avg / count;
                if (avg - stopArrivalsLastAverage[stopId] > DELAY_IN_SECONDS_THRESHOLD) {
                  console.log("Flagging " + stopName + " for delays because diff is " + (avg - stopArrivalsLastAverage[stopId])); 
                }
                stopArrivalsLastAverage[stopId] = avg;
		 
                console.log("Average (6 window) (" + stopName + "): " + avg / count);
              }

            }
            //console.log((direction == "N" ? "Uptown" : "Downtown") + " " + arrivingTrain.routeId + " in " + time + " minutes");
          });
        }
      }

      // Check if any trains haven't showed up
      for (var stopId in stopArrivals) {
        if (result.updatedOn - stopArrivals[stopId] > DELAY_IN_SECONDS_THRESHOLD) {
          if (stopArrivalsLastAverage[stopId] && (result.updatedOn - stopArrivals[stopId]) - stopArrivalsLastAverage[stopId] > DELAY_IN_SECONDS_THRESHOLD) {
            console.log("Train with stopId " + stopId + " still has not arrived.");
          }
        }
      }
    });
  }
  setInterval(trackTrains, 30000);
  trackTrains();
});

