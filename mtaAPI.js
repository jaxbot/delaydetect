const Mta = require('mta-gtfs');
const feedIds = require('./feed-ids');
const { key } = require('./config');
const fs = require('fs');
const { E } = require('./routes.js')

const mta = new Mta({key});

const MTA_MODEL = {
  // @return station info; omit stopId to get all stops
  getStop: stopId => mta.stop(stopId),  

  // @return general info about mta service; omit service type to get all services (subway, bus, BT, LIRR, MetroNorth)
  getStatus: serviceType => mta.status(serviceType),

  // @return schedule info for one station, on a single line and direction
  getStationSchedule: (stopId, feed_id, direction = 'N') => {
    return mta.schedule(stopId, feed_id)
    .then(res => res.schedule[stopId][direction]);
  },

  //@return station schedule info for array of input stops on the given feed_id (line color)
  getLine: (lineStopIds, lineName) => {
    return mta.schedule(lineStopIds, feedIds[lineName])
      .then(res => res.schedule)
  },
}

module.exports = {mta, MTA_MODEL};

const OUTPUT_SAMPLE_DATA = {
  getData: (callback, option, fileName) => {
    let dir = './sample_data';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    callback(option)
    .then(res => {
      fs.writeFile(`./sample_data/${fileName}.json`, JSON.stringify(res, null, 2), err => {
        if (err) throw err;
        console.log('Data saved');
      })
    })
    .catch(err => console.log(err));
  }
}

/* EXAMPLE CALLS FOR GENERATING SAMPLE DATA */
// OUTPUT_SAMPLE_DATA.getData(MTA_MODEL.getStatus, 'subway', 'subway-status');
// OUTPUT_SAMPLE_DATA.getData(MTA_MODEL.getStop, null, 'all-stop-data');

/* EXAMPLE CALLS FOR STATION SCHEDULES */
// MTA_MODEL.getStationSchedule('A31', 26)
// .then(res => console.log(res));

// MTA_MODEL.getLine(E, 'E')
// .then(res => console.log(res))
// .catch(err => console.err(err));