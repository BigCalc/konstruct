{ vows, should, sinon } = require 'testthings'
winston = require 'winston'
logging = 
  "Console":
	  "level": "debug"
	  "colorize": true
	  "handleExceptions": true

loggerFactory = require '../../../../app/server/support/loggerFactory'

vows.describe('loggerFactory').addBatch(
  'when loggerFactory is mixedin':
    topic: () -> loggerFactory
    'it should form an environment closure': (mod) ->
      mod.should.be.a 'function'

    'it should return a winston logger': (mod) ->

      getStub = sinon.stub()
      getStub.withArgs('logging').returns(logging)
      conf = 
      	get : getStub
      subject = mod conf
      subject.should.be.an.instanceof(winston.Logger)

).export module
