// © 2013 QUILLU INC.
// Error Handler middleware
'use strict';

var VIEWS = {
  404: '404',
  default: 'error'
};

var DEFAULT_STATUS = 500;
var DEFAULT_MESSAGE = '500 Error - Internal Server Error';

module.exports = function handleError(err, req, res, next) {
  // Normalize errors
  var status = err.status != null ? err.status : DEFAULT_STATUS;
  var userMessage = err.userMessage != null ?
                    err.userMessage :
                    DEFAULT_MESSAGE;

  res.format({
    text: function () {
      res.status(status);
      res.header('Content-Type', 'text/plain');
      res.end(userMessage);
    },

    html: function () {
      var view = VIEWS[status] ? VIEWS[status] : VIEWS.default;
      res.render(view, {status: status, title: userMessage});
    },

    json: function () {
      res.status(status);
      res.json({status: status, error: userMessage});
    }
  });
};

// Export views to customize
module.exports.VIEWS = VIEWS;
