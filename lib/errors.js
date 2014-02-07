// © 2014 QUILLU INC.
// Error Builder
'use strict';

var http = require('http');

module.exports = function buildError(status, message, userMessage) {
  if (typeof status === 'string'){
    userMessage = message;
    message = status;
    status = null;
  }

  if (status != null  && status < 400) {
    throw new Error('Status code' + status + ' is not an error');
  }

  var error = new Error();

  if (status != null) {
    error.status = status;
    error.name = http.STATUS_CODES[status];
    message = (message == null) ? '' : message + ' ';
    error.message = status + ' ERROR - '+ message + error.name;
    error.userMessage = (userMessage != null) ? userMessage : error.message;
  }else{
    error.message = message;
    if (userMessage != null) error.userMessage = userMessage;
  }

  return error;
};
