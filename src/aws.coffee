aws = require 'aws2js'

module.exports = (conf, logger) ->

  s3: aws.load('s3', conf.s3.key, conf.s3.secret).setBucket(conf.s3.bucket)
