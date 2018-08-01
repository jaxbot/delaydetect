const Mta = require('mta-gtfs');
const feed_ids = require('./feed_ids');
const { key } = require('./config');

const mta = new Mta({key});

const MTA_MODEL = {
  getStop: stopId => mta.stop(stopId),  // omit stopId to get all stops
  getStatus: serviceType => mta.status(serviceType),  // omit service type to get all services (subway, bus, BT, LIRR, MetroNorth)
  getSchedule: stopId => {
    
  },

}

module.exports = MTA_MODEL;

/* Example calls
MTA_MODEL.getStop()
.then(res => console.log(res))
.catch(err => console.err(err));

*/

// MTA_MODEL.getStatus()
// .then(res => console.log(res))
// .catch(err => console.err(err));

// mta.schedule('635', 1).then(function (result) {
//   console.log('635', result);
// });

// mta.schedule('A31', 26).then(result =>console.log(result));


// mta.schedule(['635', 'A31'], [1, 26]).then(result =>console.log(result));

// MTA_MODEL.getStop(635)
// .then(res => console.log(res))
// .catch(err => console.err(err));