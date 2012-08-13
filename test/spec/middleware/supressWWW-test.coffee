{ vows, should, sinon } = require 'testthings'

subject = require '../../../../app/server/middleware/supressWWW'

testRedirect = (srcHost, dstURL) ->
  (module) ->
    redirectSpy = sinon.spy()
    headerStub= sinon.stub()
    headerStub.withArgs('host').returns srcHost
    req = header: headerStub
    res = redirect: redirectSpy
    nextSpy = sinon.spy()

    module req, res, nextSpy
    redirectSpy.calledWith(dstURL, 301).should.be.true
    nextSpy.called.should.be.false

testNoRedirect = (srcHost, srcURL) ->
  (module) ->
    headerStub= sinon.stub()
    headerStub.withArgs('host').returns srcHost
    req = header: headerStub
    nextSpy = sinon.spy()

    module req, null, nextSpy
    nextSpy.calledOnce.should.be.true

vows.describe('Supress WWWW').addBatch(
  'when redirectTrailingSlash is mixedin':
    topic: () -> subject
    'it should be a middleware': (module) ->
      module.should.be.a 'function'
    'it should not redirect naked domains': testNoRedirect 'dump.ly'
    'it should redirect www domains': testRedirect 'www.dump.ly', 'http://dump.ly'
).export module
