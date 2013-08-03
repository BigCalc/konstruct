// © 2013 QUILLU INC.
// Redirect Middleware
// Issues 301 Moved Permanently Rediect
// with a protocol relative URL
// Trailing Slashes (/test/ -> /test)
// Supress WWW in domain (www.a.com -> a.com)
'use strict';

var RE_WWW = /^www\./,
    RE_SLASHES = /(^\/)([^?]*)(\/)(\?.*)?$/m;

module.exports = function redirects (req, res, next) {
  var port,
      host = req.header('host'),
      url = req.originalUrl;

  if (req.method === 'GET' &&
      host != null &&
      (host.match(RE_WWW) || url.match(RE_SLASHES))) {

    host = host.replace(RE_WWW, '');
    port = req.app.set('port') === 80 ?
           '' :
           (':' + req.app.set('port'));
    url = url.replace(RE_SLASHES, '$1$2$4');
    while (url.match(/\/\//)) url = url.replace(/\/\//, '/');
    res.redirect('//' + host + port + url, 301);
  } else {
    next();
  }
};
