// © 2014 QUILLU INC.
// Redis Factory
/* jshint camelcase: false */
'use strict';

var url = require('url');
var querystring = require('querystring');
var redis = require('redis');

// Create a Redis Client
// Use supplied conf and logger
var createRedis = function createRedis(conf, logger) {
  if (conf == null) throw new Error('Need Redis conf');
  var database, password;
  var parsed  = url.parse(conf.connection);
  var auth = (parsed.auth || '').split(':');
  var options = querystring.parse(parsed.query);
  var port = parsed.port;
  var hostname = parsed.hostname;

  if (hostname == null) throw new Error('Need Redis host');
  if (port == null) throw new Error('Need Redis port');
  logger.debug('Creating Redis...');

  // This logs commands
  redis.debug_mode = conf.debug || redis.debug_mode;
  var client = redis.createClient(port, hostname, options);

  if (password = auth[1]) {
    client.auth(password, function(err) {
      if (err != null) throw err;
    });
  }

  if (database = auth[0]) {
    client.select(database);
    client.on('connect', function() {
      client.send_anyways = true;
      client.select(database);
      client.send_anyways = false;
    });
  }

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
