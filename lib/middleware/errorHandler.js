// © 2014 QUILLU INC.
// Error Handler middleware
'use strict';

var DEFAULT = {
  view:'error',
  status:500,
  message:'500 Error - Internal Server Error'
};

module.exports = function handleError(err, req, res, next) {
  // Normalize errors
  var status = err.status != null ? err.status : DEFAULT.status;
  var userMessage = err.userMessage != null ?
                    err.userMessage :
                    DEFAULT.message;

  res.format({
    text: function () {
      res.status(status);
      res.header('Content-Type', 'text/plain');
      res.end(userMessage);
    },

    html: function () {
      res.render(DEFAULT.view, {status: status, title: userMessage});
    },

    json: function () {
      res.status(status);
      res.json({status: status, error: userMessage});
    }
  });
};

// Export views to customize
module.exports.DEFAULT = DEFAULT;
