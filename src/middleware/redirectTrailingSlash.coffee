# Redirect trailing slashs of URLs with a 301 Moved Permanently Rediect

errors = require '../errors'
regex = /^\/([^?]*)(\/)(\?.*)?$/m
#TODO: Fix multiple trailing slashes
#TODO: Only for GET
redirectTrailingSlash = (req, res, next) ->
  host = req.header 'host'
  port = if  (p = req.app.set 'port') is 80 then ":#{p}" else ''
  url = req.url
  if url?.match regex
    res.redirect "http://#{host}#{port}/#{url.replace(regex, '$1$3')}", 301
  else
    next()

module.exports = redirectTrailingSlash
