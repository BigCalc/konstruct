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

    Object.keys(http.STATUS_CODES).forEach( function (status) {
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
          // expect(error.userMessage).to.match(/.*ERROR.*/);
          expect(error.message).to.exist;
          expect(error.stack).to.exist;

        });
      }
    });
  });

  describe('String errors', function() {
    it('should build an Error from a string', function() {
      var error =  errors('hello error');

      expect(error).to.be.an.instanceof(Error);
      expect(util.isError(error)).to.be.true;
      expect(error.status).to.not.exist;
      expect(error.message).to.match(/hello error/);
      // expect(error.userMessage).to.not.exist;
      expect(error.name).to.exist;
      expect(error.stack).to.exist;
    });

    // it('should build an Error from a string + userMessage', function() {
    //   var error =  errors('hello error', 'friendly message');

    //   expect(error).to.be.an.instanceof(Error);
    //   expect(util.isError(error)).to.be.true;
    //   expect(error.status).to.not.exist;
    //   expect(error.message).to.match(/^hello error$/);
    //   expect(error.userMessage).to.match(/friendly message/);
    //   expect(error.name).to.exist;
    //   expect(error.stack).to.exist;
    // });

    // it('should build an Error from a code + string + userMessage', function() {
    //   var error =  errors(404, '/test', 'test Not Found');

    //   expect(error).to.be.an.instanceof(Error);
    //   expect(util.isError(error)).to.be.true;
    //   expect(error.status).to.equal(404);
    //   expect(error.message).to.match(/.*test Not Found.*$/);
    //   expect(error.userMessage).to.match(/.*test Not Found.*$/);
    //   expect(error.name).to.exist;
    //   expect(error.stack).to.exist;
    // });

  });

});
