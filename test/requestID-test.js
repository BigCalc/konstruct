// © 2014 QUILLU INC.
// createGuestID middleware Mocha test
'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('requestID middleware', function() {
  // Init
  var requestID = require('../index').requestID;

  it('should be a Connect middleware', function() {
    expect(requestID).to.be.an.instanceof(Function);
  });

  describe('Create Request ID', function() {

    it('should create a unique ID for a fresh request (/)', function() {
      var next = sinon.spy();
      var req = {};
      requestID(req, {}, next);

      expect(req.id).to.match(/^[A-Za-z0-9\-_]{16}$/m);
      expect(next).to.have.been.calledOnce;
    });

    it('should not create an id when already set)', function() {
      var next = sinon.spy();
      var req = {id: 'ahU38_-sj3DT'};
      requestID(req, {}, next);

      expect(req.id).to.match(/^[A-Za-z0-9\-_]{12}$/m);
      expect(next).to.have.been.calledOnce;
    });

  });
});
