# http://dump.ly
# http://dump.ly/
# www.dump.ly/
# dump.ly/dumps
# dump.ly/dumps/
# dump.ly/dumps/download
# dump.ly/dumps/download/
# dump.ly/dumps?q=a
# dump.ly/dumps/?q=a
# dump.ly/dumps/download?

{ vows, should, sinon } = require 'testthings'

redirectTrailingSlash = require '../../../../app/server/middleware/redirectTrailingSlash'
querystring = require 'querystring'

testRedirect = (srcHost, srcURL, dstURL) ->
  (module) ->
    redirectSpy = sinon.spy()
    headerStub= sinon.stub()
    headerStub.withArgs('host').returns srcHost
    req = header: headerStub, url: srcURL
    res = redirect: redirectSpy
    nextSpy = sinon.spy()
    module req, res, nextSpy
    redirectSpy.calledWith(dstURL, 301).should.be.true
    nextSpy.called.should.be.false

testNoRedirect = (srcHost, srcURL) ->
  (module) ->
    headerStub= sinon.stub()
    headerStub.withArgs('host').returns srcHost
    req = header: headerStub, url:  srcURL
    nextSpy = sinon.spy()

    module req, null, nextSpy
    nextSpy.calledOnce.should.be.true

vows.describe('Redirect Trailing Slash').addBatch(
  'when redirectTrailingSlash is mixedin':
    topic: () -> redirectTrailingSlash
    'it should be a middleware': (module) ->
      module.should.be.a 'function'
    'it should not redirect non simple trailing slashes': testNoRedirect 'dump.ly', '/'
    # 'it should redirect double simple trailing slashes': testRedirect 'dump.ly', '//', 'http://dump.ly'
    # 'it should redirect triple simple trailing slashes': testRedirect 'dump.ly', '///', 'http://dump.ly'
    # 'it should redirect multi simple trailing slashes': testRedirect 'dump.ly', '//////', 'http://dump.ly'
    'it should redirect nested trailing slashes': testRedirect 'dump.ly', '/dumps/', 'http://dump.ly/dumps'
    'it should not redirect nested non trailing slashes': testNoRedirect 'dump.ly', '/dumps'
    'it should not redirect query string trailing slashes': testNoRedirect 'dump.ly', '/?q=a'
    'it should redirect nested query string trailing slashes': testRedirect 'dump.ly', '/dumps/?q=a', 'http://dump.ly/dumps?q=a'
    'it should not redirect nested query string non trailing slashes': testNoRedirect 'dump.ly', '/dumps?q=a'
    'it should redirect nested query string trailing slashes with ports': testRedirect 'dump.ly:100', '/dumps/?q=a', 'http://dump.ly:100/dumps?q=a'
    'it should not redirect nested query string non trailing slashes with ports': testNoRedirect 'dump.ly:100', '/dumps?q=a'
    'it should not redirect simple trailing slashes with ports': testNoRedirect 'dump.ly:100', '/'
).export module
