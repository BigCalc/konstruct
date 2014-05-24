// © 2014 QUILLU INC.
// nConf Configuration
'use strict';
var path = require('path');

module.exports = function(build) {
  var nconf = require('nconf'),
      commonFile = path.join(process.cwd(), 'conf', 'common.json'),
      buildFile  = path.join(process.cwd(), 'conf', build + '.json'),
      secretFile = path.join(process.cwd(), 'conf', 'secrets.json');

  nconf.env('__');

  nconf.argv()
       .env()
       .file('secrets', secretFile)
       .file('build', buildFile)
       .file('common', commonFile);

  return nconf;
};
