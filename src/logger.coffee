winston = require 'winston'

# Create a logger
# debug: 0,
# info: 1,
# notice: 2,
# warning: 3,
# error: 4,
# crit: 5,
# alert: 6,
# emerg: 7
create = (conf) ->
  logger = new winston.Logger
  logger.setLevels winston.config.syslog.levels

  lConf = conf.get 'logging'
  for transport, opts of lConf
    if (t = winston.transports[transport])?
      logger.add t, opts

  logger # Return a logger

module.exports = (conf) ->
  create conf