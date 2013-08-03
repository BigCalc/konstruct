// © 2013 QUILLU INC.
// Error Logger middleware Mocha test
'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Error Logger middleware', function() {
  // Init
  var errorLogger = require('../../index').middleware.errorLogger;

  it('should be a function', function() {
    expect(errorLogger).to.be.an.instanceof(Function);
  });

  describe('Log Errors', function() {

    it('should log an non status error', function() {
      var error = new Error(),
          req = {logger: sinon.spy()},
          next = sinon.spy();

      errorLogger(error, req, {}, next);
      expect(req.logger).to.have.been.calledOne;
      expect(next).to.have.been.calledOne;

    });

    it('should log status errors > 500', function() {
      var error = new Error(),
          req = {logger: sinon.spy()},
          next = sinon.spy();
      error.status = 500;

      errorLogger(error, req, {}, next);
      expect(req.logger).to.have.been.calledOne;
      expect(next).to.have.been.calledOne;

    });

    it('should log strings ', function() {
      var error = 'err',
          req = {logger: sinon.spy()},
          next = sinon.spy();

      errorLogger(error, req, {}, next);
      expect(req.logger).to.have.been.calledOne;
      expect(next).to.have.been.calledOne;

    });

    it('should not status errors < 500', function() {
      var error = new Error(),
          req = {logger: sinon.spy()},
          next = sinon.spy();

      error.status = 404;

      errorLogger(error, req, {}, next);
      expect(req.logger).to.not.have.been.called;
      expect(next).to.have.been.calledOne;

    });
  });
});
