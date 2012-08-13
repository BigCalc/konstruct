# Inherit from `Error.prototype`.

class UnauthorizedError extends Error
  constructor: ->
    @name = 'Unauthorized'
    @status = 401
    @message = "Unauthorized"
    Error.captureStackTrace @, arguments.callee

class NotAllowedError extends Error
  constructor: ->
    @name = 'NotAllowed'
    @status = 403
    @message = "Not Allowed"
    Error.captureStackTrace @, arguments.callee

class NotFoundError extends Error
  constructor: (path) ->
    @name = 'NotFound'
    @status = 404

    if path
      @message = "#{path} Not Found"
      @path = path
    else
      @message = "Not Found"

    Error.captureStackTrace @, arguments.callee

class InternalServerError extends Error
  constructor: ->
    @name = 'InternalServerError'
    @status = 500
    @message = "Internal Server Error"
    Error.captureStackTrace @, arguments.callee

class ServiceUnavailiableError extends Error
  constructor: ->
    @name = 'ServiceUnavailiableError'
    @status = 501
    @message = 'Service is unavailable'
    Error.captureStackTrace @, arguments.callee


class DataNotFoundError extends Error
  constructor: (message) ->
    @name = 'DataNotFoundError'
    @message = "DB Query for #{message} returned null"
    Error.captureStackTrace @, arguments.callee

module.exports = 
  UnauthorizedError: UnauthorizedError
  NotAllowedError: NotAllowedError
  NotFoundError: NotFoundError
  InternalServerError: InternalServerError
  ServiceUnavailiableError: ServiceUnavailiableError
  DataNotFoundError: DataNotFoundError