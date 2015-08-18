// © 2014 QUILLU INC.
// Error Builder
'use strict';

var http = require('http');

// buildError(400)
// buildError(403, 'Forbidden')
// buildError(403,  {id:{required:true}})
// buildError(403, 'Created', {id:{required:true}})
// buildError(403, 'Created', {id:{required:true}, friendlyMessage: 'Good Job'})
module.exports = function buildError(status, message, data) {

  if (status < 400) {
    throw new Error('buildError: Status code' + status + ' is not an error!');
  }

  var name = http.STATUS_CODES[status];
  if (name == null) throw new Error('Need valid HTTP status code!');

  if (typeof message === 'object') {
    data = message;
    message = null;
  }

  if (data == null) {
    data = {};
  }

  // Adjust stack trace
  var error = new Error();
  var stack = error.stack.split('\n');
  stack.splice(1, 1);
  error.stack = stack.join('\n');

  // Add machine readable details
  var defaultMessage = status + ' ERROR - ' + name;

  error.data = data;
  error.status = status;
  error.name = name;
  error.message = message || defaultMessage;
  error.friendlyMessage = data.friendlyMessage != null ? data.friendlyMessage : defaultMessage;

  return error;
};
