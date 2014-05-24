// © 2014 QUILLU INC.
// Redirect Middleware
// Issues 301 Moved Permanently Redirect
// with a protocol relative URL
// Trailing Slashes (/test/ -> /test)
// Suppress WWW in domain (www.a.com -> a.com)
// TODO: redirect incorrect cased routes
'use strict';

var RE_WWW = /^www\./;
var RE_SLASHES = /(^\/)([^?]*)(\/)(\?.*)?$/m;
var X_FORWARDED_PORT = 'X-Forwarded-Port'.toLowerCase();
var X_FORWARDED_PROTO = 'X-Forwarded-Proto'.toLowerCase();

module.exports = function redirects(req, res, next) {
  var host = req.header(HOST);
  var url = req.originalUrl;

  if (req.method === 'GET' &&
      host != null &&
      (host.match(RE_WWW) || url.match(RE_SLASHES))) {

    // Remove www
    host = host.replace(RE_WWW, '');

    // Get correct port
    var p = req.headers[X_FORWARDED_PORT] != null ?
                parseInt(req.headers[X_FORWARDED_PORT]) :
                req.app.set('port');
    var port = p === 80 ? '' : (':' + p);

    // Remove trailing slashes
    url = url.replace(RE_SLASHES, '$1$2$4');
    while (url.match(/\/\//)) url = url.replace(/\/\//, '/');
    res.redirect('//' + host + port + url, 301);
  } else {
    next();
  }
};
