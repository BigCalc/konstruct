// © 2014 QUILLU INC.
// Error Handler middleware Mocha test
'use strict';

var app,
    chai      = require('chai'),
    expect    = chai.expect,
    sinon     = require('sinon'),
    sinonChai = require('sinon-chai'),
    request   = require('supertest'),
    express   = require('express');

chai.use(sinonChai);

describe('Error Handler middleware', function() {
  // Init
  var errorHandler = require('../index').errorHandler;

  it('should be a Connect Error Middleware', function() {
    expect(errorHandler).to.be.an.instanceof(Function);
    expect(errorHandler.length).to.be.equal(4);
  });

  it('should have a configurable views, status, message', function() {
    expect(errorHandler.DEFAULT).to.exist;
  });

  describe('should handle errors', function() {

    app = express();

    app.get('/nextError', function(req, res, next) {
      var err = new Error();
      err.status = 401;
      err.message = '401 Error';
      next(err);
    });

    app.get('/throwError', function(req, res, next) {
      throw new Error('thrown error');
    });

    app.get('/nextString', function(req, res, next) {
      next('nexted string');
    });

    app.get('/throwString', function(req, res, next) {
      throw 'thrown string';
    });

    app.use(errorHandler);

    describe('when a middleware `next(Error) status 401', function() {

      it('should send plain text errors messages on text Accept header', function(done) {
        request(app)
          .get('/nextError')
          .set('Accept', 'text/plain')
          .expect(401, /.*401.Error.*/, done);
      });

      it('should send json errors messages when acceptable', function(done) {
        request(app)
          .get('/nextError')
          .set('Accept', 'application/json')
          .expect(401, /.*401.Error.*/)
          .expect('content-type', 'application/json; charset=utf-8', done);
      });

    });

    describe('when a middleware `throws Error` (default status 500)', function() {

      it('should send plain text errors messages on text Accept header', function(done) {
        request(app)
          .get('/throwError')
          .set('Accept', 'text/plain')
          .expect(500, /.*500.*Internal Server Error.*/, done);
      });

      it('should send json errors messages when acceptable', function(done) {
        request(app)
          .get('/throwError')
          .set('Accept', 'application/json')
          .expect(500, /.*error.*/)
          .expect('content-type', 'application/json; charset=utf-8', done);
      });

    });

    describe('when a middleware `next "string" (default status 500)', function() {

      it('should send plain text errors messages on text Accept header', function(done) {
        request(app)
          .get('/nextString')
          .set('Accept', 'text/plain')
          .expect(500, /.*500.*Internal Server Error.*/, done);
      });

      it('should send json errors messages when acceptable', function(done) {
        request(app)
          .get('/nextString')
          .set('Accept', 'application/json')
          .expect(500, /.*error.*/)
          .expect('content-type', 'application/json; charset=utf-8', done);
      });

    });

    describe('when a middleware `throw "string" (default status 500)', function() {

      it('should send plain text errors messages on empty Accept header', function(done) {
        request(app)
          .get('/throwString')
          .set('Accept', 'text/plain')
          .expect(500, /.*500.*Internal Server Error.*/, done);
      });

      it('should send json errors messages when acceptable', function(done) {
        request(app)
          .get('/throwString')
          .set('Accept', 'application/json')
          .expect(500, /.*500.*Internal Server Error.*/)
          .expect('content-type', 'application/json; charset=utf-8', done);
      });

    });

    describe('when html is acceptable', function() {

      it('should send the error view by default', function() {
        var err = new Error(),
            res = {format: function(f) {f.html();}, render: sinon.spy(), status: sinon.spy()},
            next = sinon.spy();

        err.status = 401;
        err.userMessage = '401 Error';

        errorHandler(err, {}, res, next);

        expect(res.render).to.have.been.calledWith('error');
        expect(res.status).to.have.been.called;
        expect(next).to.not.have.been.called;
      });

      it('should send 404 html errors messages when acceptable', function() {
        var err = new Error(),
            res = {format: function(f) {f.html();}, render: sinon.spy(), status: sinon.spy()},
            next = sinon.spy();

        err.status = 404;
        err.userMessage = '404 Error';

        errorHandler(err, {}, res, next);

        expect(res.render).to.have.been.calledWith('error');
        expect(res.status).to.have.been.called;
        expect(next).to.not.have.been.called;

      });
    });
  });
});
