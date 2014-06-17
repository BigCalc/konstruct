// © 2014 QUILLU INC.
// Error logger
'use strict';

module.exports = function logError(err, req, res, next) {
  if (err.status == null || err.status >= 500) {
    req.logger.error({
      err: err,
      data: err.data
    });
  } else if (err.status >= 400) {
    var msg = err.message || '';
    if (!err.status && err.userMessage) msg += ' User:' + err.userMessage;
    req.logger.warn(msg);
  }
  next(err);
};
