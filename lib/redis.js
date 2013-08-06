// © 2013 QUILLU INC.
// Redis Factory
/* jshint camelcase: false */
'use strict';

var redis = require('redis');

// Create a Redis Client
// Use supplied conf and logger
var createRedis = function createRedis (conf, logger) {
  if (conf == null) throw new Error('Need Redis conf');
  if (conf.host == null) throw new Error('Need Redis host');
  if (conf.port == null) throw new Error('Need Redis port');
  logger.debug('Creating Redis...');

  // This logs commands
  redis.debug_mode = conf.debug;
  var client = redis.createClient(conf.port, conf.host, conf.options);
  if (conf.password != null) client.auth(conf.password);

  // # Log on ready events
  client.on('ready', function(err) {
    if (err != null) throw err;
    logger.info('Connected to Redis ' +
     client.server_info.redis_version + ' on ' + conf.host + ':' + conf.port);
  });

  // Log on end event
  client.on('end', function(err) {
    if (err != null) throw err;
    logger.info('Ended Connection to Redis');
  });

  return client;
};

// Public
// Create a Configued Redis Instance
module.exports = function(conf, logger) {
  return createRedis(conf, logger.child('redis'));
};
