#Suppress or force the "www." at the beginning of URLs
regex = /^www\./
suppressWWW = (req, res, next) ->
  url = req.header 'host'
  if url?.match regex
    res.redirect "http://#{url.replace(regex, '')}", 301
  else
    next()

module.exports = suppressWWW



# module.exports = function(secure) {
#   return function(req, res, next) {
#     if (/^www\./.exec(req.headers.host)) {
#       var host = req.headers.host.substring(req.headers.host.indexOf('.') + 1)
#         , url  = (secure ? 'https://' : 'http://') + host + req.url
#       res.writeHead(301, { 'Location': url });
#       return res.end();
#     }
#     return next();
#   };
# };
