// © 2014 QUILLU INC.
// forceLatestIE middleware Mocha test
'use strict';

var app,
    expect = require('chai').expect,
    request = require('supertest'),
    express = require('express');

describe('forceLatestIE middleware', function() {
  // Init
  var forceLatestIE =  require('../index').forceLatestIE;

  it('should be a Connect middleware', function() {
    expect(forceLatestIE).to.be.an.instanceof(Function);
  });

  describe('X-UA-Compatible', function() {

    beforeEach(function() {
      app = express();
      app.use(forceLatestIE);
      app.get('/', function(req, res, next){
        res.send();
      });

      app.get('/test', function(req, res, next){
        res.send();
      });

    });

    it('should not set header for non IE', function(done) {
      request(app)
        .get('/')
        .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0')
        .expect(200)
        .end(function(err, res) {
          expect(res.headers).to.not.have.property('x-ua-compatible');
          done();
        });
    });

    it('should not be set header for IE non html', function(done) {
      request(app)
        .get('/')
        .set('user-agent', 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)')
        .set('Accept', 'json')
        .expect(200)
        .end(function(err, res) {
          expect(res.headers).to.not.have.property('x-ua-compatible');
          done();
        });
    });

    it('should be set header for IE with ', function(done) {
        request(app)
          .get('/')
          .set('user-agent', 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)')
          .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
          .expect('x-ua-compatible', 'IE=Edge')
          .expect(200, done);

      });

  });
});
