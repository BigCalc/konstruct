{ vows, should, sinon } = require 'testthings'
errors = require '../../../../app/server/support/errors'
errorHandlerFactory = require '../../../../app/server/support/errorHandlerFactory'

vows.describe('errorHandlerFactory').addBatch(
  'when error is mixedin':
    topic: () -> errorHandlerFactory
    'it should be a function': (mod) ->
      mod.should.be.a 'function'
    'it should have a set of thrower middlewares': (mod) ->

      loggerSpy = sinon.spy()
      subject = mod loggerSpy
      throwers = subject.throwers

      throwers.should.exist
      [401, 403, 404, 500, 501].map (code) ->
        (->
          throwers["throw#{code}"]()
        ).should.throw()

    'it should have a logError middleware': (mod) ->
      loggerSpy = sinon.spy()
      nextSpy = sinon.spy()
      subject = mod(loggerSpy).logError
      subject(false, null, null, nextSpy)
      nextSpy.called.should.be.true

    'it should have a handleError middleware':
      topic: (mod) ->
        loggerSpy = sinon.spy()
        mod(loggerSpy).handleError

      'that handles a 404 error from the web': (subject) ->
        nextSpy = sinon.spy()
        req =
          headers:
            accept: 'html'
        renderSpy = sinon.spy()
        setHeaderSpy = sinon.spy()
        res =
          header: setHeaderSpy
          render: renderSpy
        error = new errors.NotFoundError
        subject(error, req, res, nextSpy)
        setHeaderSpy.called.should.be.true
        setHeaderSpy.args[0][1].should.eql('text/html')
        renderSpy.called.should.be.true
        renderSpy.args[0][0].should.eql('404')
        nextSpy.called.should.be.false

      'that handles a non-404 error from the web': (subject) ->
        nextSpy = sinon.spy()
        req =
          headers:
            accept: 'html'
        renderSpy = sinon.spy()
        setHeaderSpy = sinon.spy()
        res =
          header: setHeaderSpy
          render: renderSpy
        error = new errors.NotAllowedError
        subject(error, req, res, nextSpy)
        setHeaderSpy.called.should.be.true
        setHeaderSpy.args[0][1].should.eql('text/html')
        renderSpy.called.should.be.true
        renderSpy.args[0][0].should.eql('error')
        nextSpy.called.should.be.false

      'that responds with JSON to API calls': (subject) ->
        nextSpy = sinon.spy()
        req =
          headers:
            accept: 'json'
        sendSpy = sinon.spy()
        res =
          send: sendSpy
        error = new errors.NotAllowedError
        subject(error, req, res, nextSpy)
        sendSpy.called.should.be.true
        nextSpy.called.should.be.false

      'that responds with plain/text to non-web & non-API calls': (subject) ->
        nextSpy = sinon.spy()
        req =
          headers:
            accept: 'other'
        setHeaderSpy = sinon.spy()
        endSpy = sinon.spy()
        res =
          header: setHeaderSpy
          end: endSpy
        error = new errors.NotAllowedError
        subject(error, req, res, nextSpy)
        setHeaderSpy.called.should.be.true
        setHeaderSpy.args[0][1].should.eql('text/plain')
        endSpy.called.should.be.true
        nextSpy.called.should.be.false



).export module
