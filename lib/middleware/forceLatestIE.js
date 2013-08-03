// © 2013 QUILLU INC.
// ForceLatestIE Middleware
// Sets X-UA-Compatible header for IE by sniffing user-agent
// Forces IE to use latest rendering engine
'use strict';

module.exports = function forceLatestIE (req, res, next) {
  var ua = req.headers['user-agent'];
  if (ua != null &&
      ua.indexOf('MSIE') >= 0 &&
      req.accepts('html') ) {
     res.setHeader('X-UA-Compatible', 'IE=Edge');
  }
  next();
};
