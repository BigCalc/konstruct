// © 2013 QUILLU INC.
// Error logger
'use strict';

module.exports = function logError(err, req, res, next) {
  if (err.status == null || err.status >= 500){
    // FIXME: remove when winston fixes regression
    if (err.stack) {
      req.logger.error(err.stack, err);
    } else {
      req.logger.error(err);
    }
  }
  next(err);
};
