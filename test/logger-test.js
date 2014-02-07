// © 2014 QUILLU INC.
// Winston Logger Factory Mocha test
'use strict';

var expect  = require('chai').expect,
    winston = require('winston');

describe('Winston Logger Factory', function() {
  // Init
  var loggerFactory = require('../index').logger;

  var conf = {
    "Console":{
      "level": "verbose",
      "colorize": true,
      "timestamp": false,
      "handleExceptions": true,
      "exitOnError": true
    }
  }

  it('should be a function', function() {
    expect(loggerFactory).to.be.an.instanceof(Function);
  });

  describe('Create a winston logger', function() {

    it('should return a winston instance', function() {
      var logger = loggerFactory(conf);
      expect(logger).to.be.an.instanceof(winston.Logger);
      expect(logger.child).to.be.an.instanceof(Function);
    });
  });
});
