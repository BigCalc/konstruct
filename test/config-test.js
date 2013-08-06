// © 2013 QUILLU INC.
// nConf config Factory Mocha test
'use strict';

var expect  = require('chai').expect;

describe('nConf Config Factory', function() {
  // Init
  var confFactory = require('../index').config;

  var build = 'test';
  it('should be a function', function() {
    expect(confFactory).to.be.an.instanceof(Function);
  });

  describe('Create a blended config', function() {

    it('should return a nconf instance', function(){
      var conf = confFactory(build);
      expect(conf.stores.argv).to.exist;
      expect(conf.stores.env).to.exist;
      expect(conf.stores.common).to.exist;
      expect(conf.stores.secrets).to.exist;
      expect(conf.stores.build).to.exist;
    });
  });
});
