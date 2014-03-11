// © 2014 QUILLU INC.
// Create Guest ID using passy
'use strict';

var passy = require('passy');

module.exports =  function getIdentity (req, res, next) {
  if (req.session.user == null ||
      !passy.identity66.isValid(req.session.user.id)) {
    req.session.user = {
      id: passy.identity66(),
      status: 'guest'
    };
  }
  return next();
};
