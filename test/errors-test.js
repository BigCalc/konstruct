// © 2014 QUILLU INC.
// Error Builder Mocha test
'use strict';

var util   = require('util'),
    http   = require('http'),
    expect = require('chai').expect;

describe('errors builder', function() {
  // Init
  var errors = require('../index').errors;

  it('should be a function', function() {
    expect(errors).to.be.an.instanceof(Function);
  });

  describe('Create all http errors', function() {

    Object.keys(http.STATUS_CODES).forEach(function(status) {
      if (status < 400) {
        it('should not build a ' + status + ' error', function() {
          var fn = function(){ errors(+status);};
          expect(fn).to.throw(Error);
        });

      } else {
        it('should build a ' + status + ' error', function() {
          var error = errors(+status);

          expect(error).to.be.an.instanceof(Error);
          expect(util.isError(error)).to.be.true;
          expect(error.status).to.equal(+status);
          expect(error.name).to.match(new RegExp(http.STATUS_CODES[status]));
          expect(error.data).to.exist;
          expect(error.message).to.exist;
          expect(error.stack).to.exist;

        });
      }
    });
  });

});
