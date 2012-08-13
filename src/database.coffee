{path, fs, util, _} = require 'things'
redis = require 'redis'

# Create a Redis Client
# Use supplied conf and logger
createRedis = (conf, logger) ->
  logger.debug 'Creating Redis...'
  { port, host, db, password, debug, options } = conf

  # This logs commands
  redis.debug_mode = debug
  client = redis.createClient(port, host, options)
  client.auth password if password?

  # Log on ready events
  client.on 'ready', (err) ->
    throw err if err?
    logger.info "Connected to Redis #{client.server_info.redis_version} on #{host}:#{port}"

  # Log on end event
  client.on 'end', (err) ->
    throw err if err?
    logger.info "Ended Connection to Redis"

  client

# Public
# Create a Configued Redis Instance
module.exports = (conf, logger) ->
  -> createRedis conf, logger
