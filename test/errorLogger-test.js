// © 2014 QUILLU INC.
// Error Logger middleware Mocha test
'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Error Logger middleware', function() {
  // Init
  var errorLogger = require('../index').errorLogger;

  it('should be a function', function() {
    expect(errorLogger).to.be.an.instanceof(Function);
  });

  describe('should Log Errors', function() {

    it('on non http error', function() {
      var error = new Error(),
          req = { logger: { error: sinon.spy()} },
          next = sinon.spy();

      errorLogger(error, req, {}, next);
      expect(req.logger).to.have.been.calledOne;
      expect(next).to.have.been.calledOne;

    });

    it('on http errors > 500', function() {
      var error = new Error(),
          req = { logger: { error: sinon.spy()} },
          next = sinon.spy();
      error.status = 500;

      errorLogger(error, req, {}, next);
      expect(req.logger).to.have.been.calledOne;
      expect(next).to.have.been.calledOne;

    });

    it('on strings ', function() {
      var error = 'err',
          req = { logger: { error: sinon.spy()} },
          next = sinon.spy();

      errorLogger(error, req, {}, next);
      expect(req.logger).to.have.been.calledOne;
      expect(next).to.have.been.calledOne;

    });

    it('on http errors < 500', function() {
      var error = new Error(),
          req = { logger: { warn: sinon.spy()} },
          next = sinon.spy();

      error.status = 404;

      errorLogger(error, req, {}, next);
      expect(req.logger.warn).to.have.been.called;
      expect(next).to.have.been.calledOne;

    });
  });
});
