// © 2014 QUILLU INC.
// redirect middleware Mocha test
'use strict';

var app,
    expect = require('chai').expect,
    request = require('supertest'),
    express = require('express');

function noRedirect(host, path, method, port) {
  if (method == null) method = 'get';
  if (port == null) port = 80;
  return function(done) {
    app.set('port', port);
    request(app)[method](path)
      .set('host', host)
      .expect(200, done);
  };
}

function redirect(host, path, location, port) {
  if (port == null) port = 80;
  return function(done) {
    app.set('port', port);
    request(app)
      .get(path)
      .set('host', host)
      .expect('Location', location)
      .expect(301, done);
  };
}

function redirectXForwardedPort(host, path, location, port) {
  if (port == null) port = 80;
  return function(done) {
    app.set('port', port+22);
    request(app)
      .get(path)
      .set('host', host)
      .set('X-Forwarded-Port', port)
      .expect('Location', location)
      .expect(301, done);
  };
}
describe('redirect middleware', function() {
  // Init
  var redirects =  require('../../index').middleware.redirect;

  beforeEach(function() {
    app = express();
    app.use(redirects);
    app.get('/', function(req, res, next) {
      res.send();
    });

    app.all('/test', function(req, res, next) {
      res.send();
    });

  });

  it('should be a Connect middleware', function() {
    expect(redirects).to.be.an.instanceof(Function);
  });

  describe('SupressWWW', function() {
    it('should not redirect naked domains',
        noRedirect('quillu.com', '/'));

    it('should redirect www domains (/)',
        redirect('www.quillu.com', '/', '//quillu.com/'));

    it('should redirect www domains (/test)',
        redirect('www.quillu.com', '/test', '//quillu.com/test'));

    it('should redirect www domains & preserve queries (/)',
        redirect('www.quillu.com', '/?q=a', '//quillu.com/?q=a'));

    it('should redirect www domains & preserve queries (/test)',
        redirect('www.quillu.com', '/test?q=a', '//quillu.com/test?q=a'));

    it('should not redirect naked domains with PORT (/)',
        noRedirect('quillu.com', '/', 'get', 3000));

    it('should redirect www domains with PORT (/)',
        redirect('www.quillu.com', '/', '//quillu.com:3000/', 3000));

    it('should redirect www domains with X-Forwarded-Port set (/)',
        redirectXForwardedPort('www.quillu.com', '/', '//quillu.com/', 80));

    it('should not redirect naked domains with PORT (/test)',
        noRedirect('quillu.com', '/test', 'get', 3000));

    it('should redirect www domains with PORT (/test)',
        redirect('www.quillu.com', '/test', '//quillu.com:3000/test', 3000));

    it('should not redirect naked domains with PORT & preseve querystring (/)',
        noRedirect('quillu.com', '/?q=a', 'get', 3000));

    it('should redirect www domains with PORT & preseve querystring (/)',
        redirect('www.quillu.com', '/?q=a', '//quillu.com:3000/?q=a', 3000));

    it('should not redirect naked domains with PORT & preseve querystring (/test)',
        noRedirect('quillu.com', '/test?q=a', 'get', 3000));

    it('should redirect www domains with PORT & preseve querystring (/test)',
        redirect('www.quillu.com', '/test?q=a', '//quillu.com:3000/test?q=a', 3000));

    it('should not redirect POST queries',
        noRedirect('www.quillu.com', '/test?q=a', 'post'));

    it('should not redirect PUT queries',
        noRedirect('www.quillu.com', '/test', 'put'));

    it('should not redirect PATCH queries',
        noRedirect('www.quillu.com', '/test/', 'patch'));

    it('should not redirect DELETE queries',
        noRedirect('www.quillu.com', '/test/?q=a', 'del'));

    it('should not redirect HEAD queries',
        noRedirect('www.quillu.com', '/test?q=a', 'head'));

    it('should not redirect POST queries with PORT',
        noRedirect('www.quillu.com', '/test?q=a', 'post', 3000));

    it('shoud redirect www domains with trailing slashes & querystrings (/test)',
        redirect('www.quillu.com', '/test/?q=a', '//quillu.com/test?q=a'));

    it('shoud redirect www domains with PORT & trailing slashes & preserve querystrings (/test)',
        redirect('www.quillu.com', '/test/?q=a', '//quillu.com/test?q=a'));

  });

  describe('Redirect Trailing Slash', function() {
    it('should not redirect trailing slashes (/)',
        noRedirect('quillu.com', '/'));

    it('should redirect double trailing slashes (/)',
        redirect('quillu.com', '//', '//quillu.com/'));

    it('should redirect triple trailing slashes (/)',
        redirect('quillu.com', '///', '//quillu.com/'));

    it('should redirect multi trailing slashes (/)',
        redirect('quillu.com', '//////', '//quillu.com/'));

    it('should redirect trailing slashes (/test)',
        redirect('quillu.com', '/test/', '//quillu.com/test'));

    it('should not redirect non-trailing slashes (/test)',
        noRedirect('quillu.com', '/test'));

    it('should not redirect query string trailing slashes (/)',
        noRedirect('quillu.com', '/?q=a'));

    it('should redirect query string trailing slashes (/test)',
        redirect('quillu.com', '/test/?q=a', '//quillu.com/test?q=a'));

    it('should not redirect query string non-trailing slashes (/test)',
        noRedirect('quillu.com', '/test?q=a'));

    it('should redirect trailing slashes with PORT (/test)',
        redirect('quillu.com', '/test/', '//quillu.com:3000/test', 3000));

    it('should redirect query string trailing slashes with PORT (/test)',
        redirect('quillu.com', '/test/?q=a', '//quillu.com:3000/test?q=a', 3000));

    it('should not redirect nested query string non-trailing slashes with PORT',
        noRedirect('quillu.com:100', '/test?q=a', 'get', 3000));

    it('should not redirect trailing slashes with PORT (/)',
        noRedirect('quillu.com', '/', 'get', 3000));

    it('should not redirect trailing slashes with PORT (/test)',
        noRedirect('quillu.com', '/test', 'get', 3000));

    it('should not redirect POST queries',
        noRedirect('quillu.com', '/test/?q=a', 'post'));

    it('should not redirect PUT queries',
        noRedirect('quillu.com', '/test/', 'put'));

    it('should not redirect PATCH queries',
        noRedirect('quillu.com', '/test?q=a', 'patch'));

    it('should not redirect DELETE queries',
        noRedirect('quillu.com', '/test/', 'del'));

    it('should not redirect HEAD queries',
        noRedirect('quillu.com', '/test/?q=a', 'head'));
  });
});
