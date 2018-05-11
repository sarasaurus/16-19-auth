'use strict';

var server = require('./lib/server');
var logger = require('./lib/logger');

server.start(process.env.PORT, function () {
  return logger.log(logger.INFO, 'MAIN: listening on ' + process.env.PORT);
});