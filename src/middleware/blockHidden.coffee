# TODO: Is this needed?
errors = require '../errors'

blockHidden = (req, res, next) ->

  url = req.url

  if url?.match /(^|\/)\./
    next new errors.NotAllowedError()
  else
    next()

module.exports = blockHidden
