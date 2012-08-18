{path, fs, util, _} = require 'things'
errors = require './errors'

throwers =
  throw401: (req, res, next) ->
    next new errors.UnauthorizedError req.url

  throw404: (req, res, next) ->
    next new errors.NotFoundError req.url

  throw403: (req, res, next) ->
    next new errors.NotAllowedError

  throw500: (req, res, next) ->
    next new errors.InternalServerError

  throw501: (req, res, next) ->
    next new errors.ServiceUnavailiableError


# Public
module.exports = (logger) ->
  throwers: throwers

  logError: (err, req, res, next) ->
    logger.error "#{err.status?=''} Error - #{err.message}\n#{err.stack}" if err
    next err

  # Error Handling
  handleError: (err, req, res, next) ->
    status = unless err.status then err.status = 500 else err.status
    accept = _ req.headers.accept
    message = "#{status} Error - #{err.message}"
    if accept.includes 'html'
      view = if err instanceof errors.NotFoundError then '404' else 'error'
      res.header 'Content-Type', 'text/html'
      res.render view,
        status: status
        title: message
        user: null
    else if accept.includes 'json'
      res.send error: message, status
    else
      res.header 'Content-Type', 'text/plain'
      res.end message

  setupRoutes: (app) ->
    app.get '/401', throwers.throw401
    app.get '/403', throwers.throw403
    app.get '/404', throwers.throw404
    app.get '/500', throwers.throw500
    app.get '/501', throwers.throw501
