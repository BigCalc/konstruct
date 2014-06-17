// © 2014 QUILLU INC.
// blockHidden middleware Mocha test
'use strict';

var app,
    expect = require('chai').expect,
    request = require('supertest'),
    express = require('express');


describe('blockHidden middleware', function() {
  // Init
  var blockHidden = require('../index').blockHidden;

  it('should be a Connect middleware', function() {
    expect(blockHidden).to.be.an.instanceof(Function);
  });

  describe('Hidden files', function() {

    beforeEach(function() {
      app = express();
      app.use(blockHidden);
      app.use(function(err, req, res, next) {
        if(err){
          res.send(err.status);
        }else {
          next();
        }
      });

      app.get('/', function(req, res, next) {
        res.send();
      });

      app.get('/test', function(req, res, next) {
        res.send();
      });

    });

    it('should not be hidden for normal requests (/test)', function(done) {
      request(app)
        .get('/test')
        .expect(200, done);
    });

    it('should block . (/.git)', function(done) {
      request(app)
        .get('/.git')
        .expect(403, done);
    });

    it('should block . with query (/.npmignore)', function(done) {
      request(app)
        .get('/.npmignore?q=a')
        .expect(403, done);
    });

  });
});
