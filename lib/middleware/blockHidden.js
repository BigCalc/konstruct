// © 2014 QUILLU INC.
// Block Hidden Files
'use strict';

var errors = require('../errors'),
    HIDDEN = /(^|\/)\./;

module.exports = function blockHidden(req, res, next) {
  var url = req.url;
  if (url != null && url.match(HIDDEN)) {
    next(errors(403, url));
  } else {
    next();
  }
};
