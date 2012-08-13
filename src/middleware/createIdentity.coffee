#create a trackingId for guest users
identity = require 'passy'

getIdentity = (req, res, next) ->
  if !identity.verify(req.session.user?.id)
    req.session.user =
      id: identity()
      status: 'guest'
  next()

module.exports = getIdentity
