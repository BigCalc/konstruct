{ vows, should, sinon } = require 'testthings'
databaseFactory = require '../../../../app/server/support/databaseFactory'

fakes =require '../../../fakes'
redis = require 'redis'

module.exports.suit = vows.describe('databaseFactory').addBatch
  'when databaseFactory is mixedin':
    topic: () -> databaseFactory
    'it should form an environment closure': (mod) ->
      mod.should.be.a 'function'

    'it should create a redis instance': (mod) ->
      conf =
        debug: false
        password: 'abc'
        port: 100
        host: 'localhost'
        options: null

      subject = mod conf, fakes.logger

      subject.on 'error', (err) ->
        err.message.should.equal('Redis connection to localhost:100 failed - connect ECONNREFUSED')

      subject.host.should.equal conf.host
      subject.port.should.equal conf.port
      subject.auth_pass.should.equal conf.password
      subject.should.be.an.instanceof redis.RedisClient
