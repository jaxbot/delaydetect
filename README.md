## DelayDetect

DelayDetect is an API that that compiles and processes feed data from the [GTFS (General Transit Feed Specification) Realtime](https://developers.google.com/transit/gtfs-realtime/ "GTFS Documentation") feed specification developed by Google and Live Transit Updates. The GTFS Realtime data exchange format uses [Protocol Buffers](https://developers.google.com/protocol-buffers/, "Protocol Buffer Documentation") which developers can compile into streams using a `.proto` file. DelayDetect relies on **protobuf.js** for Node.js support.

The accompanying web client for DelayDetect uses our own API to provide users with simple-to-read visualizations about the health of a subway line, delays, and station information. Riders will then be able to make transition decisions and plan a smoother trip.

## MTA Stats
- 6,418 subway cars
- ~3 billion annual ridership