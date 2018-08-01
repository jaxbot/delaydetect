const Mta = require('mta-gtfs');

const mta = new Mta({
  key: require("./config").key,
  feed_id: 26
});

module.exports = {
  getAllStops: () => mta.stop(),
  getOneStop: stopId => mta.stop(stopId),
  getSchedule: () => {

  },

}