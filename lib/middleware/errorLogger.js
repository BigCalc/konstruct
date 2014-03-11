// © 2014 QUILLU INC.
// Error logger
'use strict';

module.exports = function logError (err, req, res, next) {
  if (err.status == null || err.status >= 500){
    // FIXME: remove when winston fixes regression
    if (err.stack) {
      req.logger.error(err.stack, err);
    } else {
      req.logger.error(err);
    }
  } else if (err.status >= 400) {
    // TODO: Unify with error logger
    var msg = err.message || '';
    if (!err.status && err.userMessage) msg += ' User:' + err.userMessage;

    req.logger.warn(msg);
  }
  next(err);
};
