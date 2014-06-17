// © 2014 QUILLU INC.
// guestID middleware Mocha test
'use strict';

var app,
    expect = require('chai').expect,
    request = require('supertest'),
    express = require('express'),
    cookieSession =  require('cookie-session');


describe('guestID middleware', function() {
  // Init
  var guestID = require('../index').guestID;

  it('should be a Connect middleware', function() {
    expect(guestID).to.be.an.instanceof(Function);
  });

  describe('Create Guest ID', function() {

    beforeEach(function() {
      app = express();
      app.use(cookieSession({signed:false}));
      app.use(guestID);

      app.get('/', function(req, res, next) {
        res.send(req.session.user.id);
      });

      app.get('/test', function(req, res, next) {
        res.send(req.session.user.id);
      });

    });

    it('should create a ID on fresh request (/)', function(done) {
      request(app.listen())
        .get('/')
        .expect(200, /^[_\-0-9-A-Za-z]{11}$/m, done);
    });

    it('should return same id when already set)', function(done) {
      request(app.listen())
        .get('/test')
        .expect(200)
        .end (function(err, res) {
          var userID = res.text;
          request(app)
          .get('/test')
          .set('cookie', res.header['set-cookie'])
          .expect(200, userID, done);
        });
    });

  });
});
