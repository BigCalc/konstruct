# Better website experience for IE users
# Force the latest IE version, in cases when it may fall back to IE7 mode

forceLatestIE = (req, res, next) ->

  url = req.url
  ua = req.headers['user-agent']

  if ua?.indexOf('MSIE') and /htm?l$/.test(url)
    res.setHeader 'X-UA-Compatible', 'IE=Edge,chrome=1'

  next()

module.exports = forceLatestIE
