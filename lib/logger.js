// © 2014 QUILLU INC.
// Logger Factory
'use strict';
var util = require('util');
var winston = require('winston');

// Create
module.exports = function(conf) {
  var logger, opts, t, transport;

  logger = new winston.Logger();

  // Add transports
  for (transport in conf) {
    if (conf.hasOwnProperty(transport)){
      opts = conf[transport];
      if ((t = winston.transports[transport]) != null) {
        logger.add(t, opts);
      }
    }
  }

  //
  // ### function child (sub, props)
  // #### @sub {string} Sub level for message.
  // #### @props {Object} **Optional** Metadata to extent meta
  // Create a specialized logger for sub-compartments
  //
  logger.child = function(sub, props){
    var child = {};
    if (sub == null) return new Error ('Need child name');
    if (props == null) props = {};

    ['log', 'profile', 'startTimer'].forEach(function(method) {
      child[method] = function() {
        return logger[method].apply(logger, arguments);
      };
    });

    var fn = function(level){
          child[level] = function () {
            var callback, meta, msg,
                args = Array.prototype.slice.call(arguments);
            callback = typeof args[args.length - 1] === 'function' ? args.pop() : null,
            meta     = typeof args[args.length - 1] === 'object' ? args.pop() : {},
            msg      = sub + ': ' + util.format.apply(null, args);

            for (var prop in props){
              if (props.hasOwnProperty(prop)) {
                meta[prop] = props[prop];
              }
            }
            meta.sub = sub;

            // TODO: Use call/apply?
            if (callback == null){
              logger[level](msg, meta);
            } else {
              logger[level](msg, meta, callback);
            }
          };

        };

    for (var level in logger.levels) {
      if (logger.levels.hasOwnProperty(level)) {
        fn(level);
      }
    }

    return child;

  };

  return logger;
};

