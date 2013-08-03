// © 2013 QUILLU INC.
// Passy ID Middleware
// Add unique id to each request
// Uses passy.random, 64bit URL encoded
'use strict';

var passy = require('passy');

module.exports = function passyID (req, res, next) {
    if (req.id == null){
      req.id = passy.random();
      // TODO: Add X-Request-Id header?
    }
    next();
};
