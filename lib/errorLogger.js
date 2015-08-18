// © 2014 QUILLU INC.
// Error logger
'use strict';

module.exports = function logError(err, req, res, next) {
  if (err.status == null) {
    req.logger.error(err);
  } else if (err.status >= 500) {
    req.logger.error({
      err: err,
      status: err.status,
      message: err.message,
      data: err.data
    });
  } else if (err.status >= 400) {
    req.logger.warn(err.message);
  }
  next(err);
};
