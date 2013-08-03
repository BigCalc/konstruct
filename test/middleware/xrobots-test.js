// © 2013 QUILLU INC.
// xrobots middleware Mocha test
'use strict';

var expect = require('chai').expect,
    request = require('supertest'),
    express = require('express');


describe('xrobots middleware', function() {
  // Init
  var xrobots =  require('../../index').middleware.xrobots,
      robots = ['all', 'noindex', 'nofollow', 'none',
                'noarchive', 'nosnippet', 'noodp',
                'notranslate', 'noimageindex'];

  robots.forEach(function (robot) {
    it(robot + ' should be a Connect middleware', function() {
      expect(xrobots[robot]).to.be.an.instanceof(Function);
    });
  });

  describe('X-Robots-Tag', function() {

    robots.forEach(function (header) {
      it('should set x-robot-tag: ' + header, function(done) {
        var app = express();
        app.use(xrobots[header]);
        app.get('/', function(req, res, next){
          res.send();
        });

        request(app)
          .get('/')
          .expect('x-robots-tag', header)
          .expect(200, done);
      });
    });

    it('should set x-robot-tag unavailable_after', function(done) {
      var app = express();
      var date = new Date('Fri, 25 Jun 2010 23:00:00 GMT');
      var robot = xrobots.unavailableAfter(date);
      app.use(robot);
      app.get('/', function(req, res, next){
        res.send();
      });
      expect(robot).to.be.an.instanceof(Function);
      app.use(robot);
      request(app)
        .get('/')
        .expect('x-robots-tag', 'unavailable_after: Fri, 25 Jun 2010 23:00:00 GMT')
        .expect(200, done);
    });

    it('should set multiple headers', function(done) {
      var app = express();
      app.use(xrobots.nofollow);
      app.use(xrobots.notranslate);
      app.use(xrobots.noodp);
      app.get('/test', function(req, res, next){
        res.send();
      });

      request(app)
        .get('/test')
        .expect('x-robots-tag', 'nofollow, notranslate, noodp')
        .expect(200, done);
    });

  });
});
