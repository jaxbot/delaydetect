const stops = require('./sample_data/allStopData.json');

// console.log(stops);

const routes = {
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
  'S': [],
  'A': [],
  'C': [],
  'E': ['G21', 'F09', 'F11', 'F12', 'D14', 'A25', 'A27', 'A28', 'A30', 'A31', 'A32', 'A33', 'A34', 'E01'],
  'H': [],
  'FAS': [],
  'N': [],
  'Q': [],
  'R': [],
  'W': [],
  'B': [],
  'D': [],
  'F': [],
  'M': [],
  'L': [],
  'SIR': [],
  'G': [],
  'J': [],
  'Z': [],
  '7': []
}

const routeObj = (() => {
  let data = {};
  for (let route of Object.keys(routes)) {
    let routeInfo = routes[route].map(stop => {
      return {[stop]: stops[stop].stop_name}
    });
    data[route] = routeInfo;
  }
  return data;
})();

// console.log(routeObj);

module.exports = {routes, routeObj};