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
  var message = err.message || status + DEFAULT.message;
  var data = err.data || {};

  res.format({
    default: function () {
      res.status(status);
      res.header('Content-Type', 'text/plain');
      res.end(message);
    },

    html: function () {
      res.render(DEFAULT.view, {
        status: status,
        title: 'Error',
        message: message
      });
    },

    json: function () {
      res.status(status);
      res.json({
        error: true,
        status: status,
        message: message,
        data: data
      });
    }
  });
};

// Export views to customize
module.exports.DEFAULT = DEFAULT;
