// © 2014 QUILLU INC.
// Create Guest ID using passy
'use strict';

var identity = require('passy');

module.exports =  function getIdentity (req, res, next) {
  if (req.session.user == null ||
      !identity.verify(req.session.user.id)) {
    req.session.user = {
      id: identity(),
      status: 'guest'
    };
  }
  return next();
};
