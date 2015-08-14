// © 2014 QUILLU INC.
// Error Builder
'use strict';

var http = require('http');

// buildError(400)
// buildError(403, 'Forbidden')
// buildError(403, 'Created', 'Good Job')
// buildError(403, 'Created', 'Good Job', {id:1})
// buildError(403, 'Created', {id:1})
// buildError('Created', 'Good Job', {id:1})
// buildError('Created', {id:1})
module.exports = function buildError(status, message, data) {
  if (typeof message === 'object') {
    data = message;
    message = null;
  }

  if (typeof status === 'string') {
    message = status;
    status = null;
  }

  if (status == null && message == null) {
    throw new Error('buildError: Need either status or message');
  }

  if (status != null && status < 400) {
    throw new Error('buildError: Status code' + status + ' is not an error');
  }

  // Adjust stack trace?
  var error = new Error();
  var stack = error.stack.split('\n').splice(1, 1);
  error.stack = stack.join('\n');

  // Add machine readable details
  error.data = data;

  if (status != null) {
    error.status = status;
    error.name = http.STATUS_CODES[status];
    error.message = message || status + ' ERROR - ' + error.name;
    error.userMessage = error.message;
  } else {
    error.message = message;
  }

  return error;
};
