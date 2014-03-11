// © 2014 QUILLU INC.
// Error Handler middleware
'use strict';

var DEFAULT = {
  view:    'error',
  status:  500,
  message: ' Error - Internal Server Error'
};

module.exports = function handleError (err, req, res, next) {
  // Normalize errors
  var status = err.status || DEFAULT.status;
  var userMessage = err.userMessage || status + DEFAULT.message;
  var data = err.data || {};

  res.format({
    default: function () {
      res.status(status);
      res.header('Content-Type', 'text/plain');
      res.end(userMessage);
    },

    html: function () {
      res.render(DEFAULT.view, {
        status: status,
        title: 'Error',
        message: userMessage
      });
    },

    json: function () {
      res.status(status);
      res.json({
        error: true,
        status: status,
        message: userMessage,
        data: data
      });
    }
  });
};

// Export views to customize
module.exports.DEFAULT = DEFAULT;
