const Mta = require('mta-gtfs');
const feed_ids = require('./feed_ids');
const { key } = require('./config');
const fs = require('fs');

const mta = new Mta({key});

const MTA_MODEL = {
  getStop: stopId => mta.stop(stopId),  // omit stopId to get all stops
  getStatus: serviceType => mta.status(serviceType),  // omit service type to get all services (subway, bus, BT, LIRR, MetroNorth)
  getSchedule: stopId => {
    
  },

}

// module.exports = MTA_MODEL;
module.exports = mta;

const OUTPUT_SAMPLE_DATA = {
  getAllStops: () => {
    let dir = './sample_data';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    MTA_MODEL.getStop()
    .then(res => {
      fs.writeFile('./sample_data/allStopData.json', JSON.stringify(res, null, 2), err => {
        if (err) throw err;
        console.log('all stops data saved');
      })
    })
    .catch(err => console.log(err));
  },
  getMTAStatus: (serviceType = 'subway') => {
    let dir = './sample_data';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    MTA_MODEL.getStatus(serviceType)
    .then(res => {
      fs.writeFile('./sample_data/allMTAStatus.json', JSON.stringify(res, null, 2), err => {
        if (err) throw err;
        console.log('all status data saved');
      })
    })
    .catch(err => console.log(err));
  },
}

// OUTPUT_SAMPLE_DATA.getAllStops();
// OUTPUT_SAMPLE_DATA.getMTAStatus();

// MTA_MODEL.getStatus()
// .then(res => console.log(res))
// .catch(err => console.err(err));

// mta.schedule('635', 1).then(function (result) {
//   console.log('635', result);
// });

// mta.schedule('A31', 26).then(result => console.log(result.schedule['A31']));
// mta.schedule('725', 16).then(result => console.log(result.schedule['725']));
// mta.schedule('R16', 16).then(result => console.log(result.schedule['R16']));
// mta.schedule('902').then(result => console.log(result.schedule['902']));

mta.schedule('R16', 16).then(result => console.log(result.schedule['R16']));

// mta.schedule(['635', 'A31'], [1, 26]).then(result =>console.log(result));

// MTA_MODEL.getStop(635)
// .then(res => console.log(res))
// .catch(err => console.err(err));