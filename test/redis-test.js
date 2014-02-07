// © 2014 QUILLU INC.
// Redis Factory Mocha test
/* jshint camelcase: false */
'use strict';

var expect = require('chai').expect,
    sinon  = require('sinon'),
    redis  = require('redis');

describe('Redis Factory', function() {
  // Init
  var redisFactory = require('../index').redis;

  var conf = {
      debug: false,
      password: 'abc',
      port: 100,
      host: 'localhost',
      options: null
    };

  it('should be a function', function() {
    expect(redisFactory).to.be.an.instanceof(Function);
  });

  describe('Create a configured redis', function() {

    it('should return a redis instance', function(){
      var loggerStub = {child: sinon.stub().returns({
          debug:sinon.stub(),
          info:sinon.stub()
        })};

      var r = redisFactory(conf, loggerStub);
      r.on('error', function(e){
        expect(e.message).to.match(/localhost:100/);
        expect(r).to.be.an.instanceof(redis.RedisClient);
        expect(r.host).to.equal(conf.host);
        expect(r.port).to.equal(conf.port);
        expect(r.auth_pass).to.equal(conf.password);
      });
    });
  });
});

