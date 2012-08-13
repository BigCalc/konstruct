{ vows, should, sinon } = require 'testthings'
_ = require 'underscore'
ResourceRouter = require '../../../../app/server/middleware/ResourceRouter'
fakes = require '../../../fakes'
querystring = require 'querystring'


notMatch = (url, method='GET', err) ->
  r = new ResourceRouter()
  controller = {}
  r.add 'users', controller
  m = r.middleware()

  req =
    url: url
    method: method
  res = {}

  next = sinon.spy()
  m req, res, next

  sinon.assert.calledOnce next
  if err?
    next.args[0][0].should.be.an.instanceof Error

match = (url, method, action, id, map, err, status = 200) ->
  body = {a:1, b: false, c:{l:'left',r:'right'}}
  qs = '?tok=3aA&fields=[a,b,c]'
  msg =
    a:1
    b:false
    c:
      l:'left'
      r:'right'
    tok:'3aA'
    fields:['a','b','c']
  retMsg =
    id: '8239fab31'
    status: 'hehe'
    data: 'boomboom'
  reply =
    meta:
      status: status
    data: retMsg

  if status is 201
    reply.meta.location = 'http://dump.ly:3030/users/8239fab31'

  controller = {mapping:{}}
  if err
    controller[action] = sinon.stub().yields new Error 'booboo'
  else
    controller[action] = sinon.stub().yields null, retMsg, status

  if map?
    controller.mapping[map] = controller[action]

  r = new ResourceRouter()
  r.add 'users', controller
  m = r.middleware()

  req =
    url: url + qs
    method: method
    body: body
    host: 'dump.ly:3030'
  res =
    send: sinon.stub()
    header: sinon.stub()
  next = sinon.stub()

  m req, res, next

  if status is 201
    sinon.assert.calledWith res.header, 'Location', 'http://dump.ly:3030/users/8239fab31'
  else
    sinon.assert.notCalled res.header

  if err?
    sinon.assert.calledOnce next
    next.args[0][0].should.be.an.instanceof Error
    sinon.assert.notCalled res.send
  else
    sinon.assert.notCalled next
    sinon.assert.calledWith res.send, reply, status

  if id?
    sinon.assert.calledOnce controller[action]
    sinon.assert.calledWith controller[action], id, msg
  else
    sinon.assert.calledOnce controller[action]
    sinon.assert.calledWith controller[action], msg

empty = ->

commentController =
  mapping:
    'DELETE disable': empty
    'PUT /star': empty
  nested:
    starred:{}

userController =
  mapping:
    'GET /follows': empty
    'POST login': empty
  nested:
    comments: commentController

exports.suit = vows.describe('Abstract Provider').addBatch
  'when Resources is mixedin':
    topic: -> ResourceRouter
    'it should be a Contructor': (R) ->
      should.isFunction R
      resources = new R()
      should.exist resources
    'given a new Resources object':
      topic: (R) -> new R()
      'it should be able to add Controllers': (r) ->
        should.isFunction r.add
        stubController = {}
        result = r.add 'users', stubController
        should.exist result
      'add Controllers should be chainable': (r) ->
        stubController = {}
        result = r.add 'users', stubController
        result.should.equal r
      'it should create a http middleware': (r) ->
        should.isFunction r.middleware
        middle = r.middleware()
        should.exist middle
    'given a configured Resources Object with a controller':
      topic: (R) ->
          r = new R()
          r.add 'users', userController
          r
      'it should return null on empty request': (rr) ->
        path = ''
        result = rr.parse path
        should.not.exist result
      'it should return null on slash request': (rr) ->
        path = '/'
        result = rr.parse path
        should.not.exist result
      'it should return null on wrong resource': (rr) ->
        path = '/bobo'
        result = rr.parse path
        should.not.exist result
      'it should return null on wrong resource with trailing slash': (rr) ->
        path = '/bobo/'
        result = rr.parse path
        should.not.exist result
      'it should return null on wrong resource with no slash': (rr) ->
        path = 'bobo/'
        result = rr.parse path
        should.not.exist result
      'it should return null on wrong nested resource': (rr) ->
        path = '/bobo/users'
        result = rr.parse path
        should.not.exist result
      'it should find a collection resource': (rr) ->
        path = '/users'
        result = rr.parse path
        should.deepEqual result, [resource: 'users', controller: userController]
      'it should find a individual resource': (rr) ->
        path = '/users/44'
        result = rr.parse path
        should.deepEqual result, [resource: 'users', id: '44', controller: userController]
      'it should find a action on a collection resource': (rr) ->
        path = '/users/login'
        result = rr.parse path, 'POST'
        should.deepEqual result, [resource: 'users', action: empty, controller: userController]
      # 'it should not find a individual action on a collection resource': (rr) ->
      #   path = '/users/follows'
      #   result = rr.parse path
      #   should.not.exist result
      'it should find a action on a individual resource': (rr) ->
        path = '/users/55a/follows'
        result = rr.parse path
        should.deepEqual result, [resource: 'users', id: '55a', action: empty, controller: userController]
      'it not should find a individual action on a collection': (rr) ->
        path = '/users/55a/login'
        result = rr.parse path, 'POST'
        should.not.exist result
      'it should find a collection resource on a nested resource': (rr) ->
        path = '/users/44/comments'
        result = rr.parse path
        should.deepEqual result, [{resource: 'comments', controller: commentController}, {resource: 'users', id: '44', controller: userController}]
      'it should find a individual resource on a nested resource': (rr) ->
        path = '/users/44/comments/jk1'
        result = rr.parse path
        should.deepEqual result, [{resource: 'comments', id: 'jk1', controller: commentController}, {resource: 'users', id: '44', controller: userController}]
      'it should find a collection action on a nested resource': (rr) ->
        path = '/users/44/comments/disable'
        result = rr.parse path, 'DELETE'
        should.deepEqual result, [{resource: 'comments', action: empty, controller: commentController}, {resource: 'users', id: '44', controller: userController}]
      'it should find a individual action on a nested resource': (rr) ->
        path = '/users/44/comments/oo1/star'
        result = rr.parse path, 'PUT'
        should.deepEqual result, [{resource: 'comments', action: empty, id: 'oo1', controller: commentController}, {resource: 'users', id: '44', controller: userController}]
      'it should find a doubly nested collection resource': (rr) ->
        path = '/users/44/comments/oo1/starred'
        result = rr.parse path
        should.deepEqual result, [{resource: 'starred', controller: {}}, {resource: 'comments', id: 'oo1', controller: commentController}, {resource: 'users', id: '44', controller: userController}]
      'it should find a doubly nested individual resource': (rr) ->
        path = '/users/44/comments/oo1/starred/1'
        result = rr.parse path
        should.deepEqual result, [{resource: 'starred', id:'1', controller: {}}, {resource: 'comments', id: 'oo1', controller: commentController}, {resource: 'users', id: '44', controller: userController}]
      'it should not find a unknown nested resource': (rr) ->
        path = '/users/44/comments/disable/oo1/starred/1'
        result = rr.parse path
        should.not.exist result

    'it should be able to build a message from a HTTP request':
      topic: (R) -> new R()
      'it should return a empty message given a empty body and querystring': (rr) ->
        result = rr.buildMessage()
        should.deepEqual result, {}
      'it should join messages given a body and querystring': (rr) ->
          body = {a:1, b: false, c:{l:'left',r:'right'}}
          qs = querystring.parse 'tok=3aA&fields=age'

          msg =
            a:1
            b:false
            c:
              l:'left'
              r:'right'
            tok:'3aA'
            fields:'age'

          result = rr.buildMessage body, qs
          should.deepEqual result, msg
      'it should join messages given a body and an array querystring': (rr) ->
          body = {a:1, b: false, c:{l:'left',r:'right'}}
          qs = querystring.parse 'tok=3aA&fields=[a,b,c]'

          msg =
            a:1
            b:false
            c:
              l:'left'
              r:'right'
            tok:'3aA'
            fields:['a','b','c']

          result = rr.buildMessage body, qs
          should.deepEqual result, msg

    'given a configured Resources object middleware with http requests':
      'it should not route empty requests': (R) ->
        notMatch '/'
      'it should not route non matching collection requests': (R) ->
        notMatch '/bobo/'
      'it should not route non matching individual requests': (R) ->
        notMatch '/bobo/4'
      'it should not route non matching individual requests with query string': (R) ->
        notMatch '/bobo/4/delete?asdad=22'

      'it should route a GET on root to index': (R) ->
        match '/users', 'GET', 'index'
      'it should route a GET on id to show': (R) ->
        match '/users/bob', 'GET', 'show', 'bob'

      'it should route a POST on root to create': (R) ->
        match '/users', 'POST', 'create', null, null, null, 201
      'it should not route a POST on id': (R) ->
        notMatch '/users/bob', 'POST', true

      'it should not route a PUT on root': (R) ->
        match '/users', 'PUT', 'updateBatch'
      'it should route a PUT on id': (R) ->
        match '/users/bob', 'PUT', 'update', 'bob'

      'it should route a DELETE on root to clear': (R) ->
        match '/users', 'delete', 'clear'
      'it should route a DELETE on id to destroy': (R) ->
        match '/users/bob', 'DELETE', 'destroy', 'bob'

      'it should route a GET on root to action': (R) ->
        match '/users/login', 'GET', 'login', null, 'GET login'
      'it should route a GET on id to action': (R) ->
        match '/users/bob/login', 'GET', 'login', 'bob', 'GET /login'

      'it should route a POST on root to action': (R) ->
        match '/users/teapot', 'POST', 'teapot', null, 'POST teapot'
      'it should route a POST on id to action': (R) ->
        match '/users/bob/teapot', 'POST', 'createTeapot', 'bob', 'POST /teapot'

      'it should route a PUT on root to action': (R) ->
        match '/users/follows', 'PUT', 'follows', null, 'PUT follows'
      'it should route a PUT on id to action': (R) ->
        match '/users/bob/follows', 'PUT', 'follows', 'bob', 'PUT /follows'

      'it should route a DELETE on root to action': (R) ->
        match '/users/friends', 'DELETE', 'friends', null, 'DELETE friends'
      'it should route a DELETE on id to action': (R) ->
        match '/users/bob/friends', 'DELETE', 'friends', 'bob', 'DELETE /friends'

      'it should next a error on UNKNOWN method to error': (R) ->
        notMatch '/users', 'POT', true
      'it should next a error on when controller errors': (R) ->
        match '/users', 'POST', 'create', null, null, true

      'it should route a nested GET on individual to show': (R) ->
        body = a:1
        retMsg =
          status: 'hehe'
          data: 'boomboom'
        reply =
          meta:
            status: 200
          data: retMsg
        imageController =
            mapping:{}
            show: sinon.stub().yields null, retMsg

        controller =
          mapping:{}
          nested:
            images: imageController

        r = new ResourceRouter()
        r.add 'users', controller
        m = r.middleware()

        req =
          url: '/users/bob/images/15'
          method: 'GET'
          body: body
        res =
          send: sinon.spy()
        next = sinon.spy()

        m req, res, next

        sinon.assert.notCalled next
        sinon.assert.calledWith res.send, reply, 200

        sinon.assert.calledOnce imageController.show
        sinon.assert.calledWith imageController.show, '15', body, 'bob'

      'it should route a double nested POST on individual to create': (R) ->
        body = {}
        retMsg =
          status: 'hehe'
          data: 'boomboom'
        reply =
          meta:
            status: 200
          data: retMsg

        starsController =
          create: sinon.stub().yields null, retMsg
        imageController =
          nested:
            stars: starsController
        controller =
          nested:
            images: imageController

        r = new ResourceRouter()
        r.add 'users', controller
        m = r.middleware()

        req =
          url: '/users/bob/images/5/stars'
          method: 'POST'
          body: body
        res =
          send: sinon.spy()
        next = sinon.spy()

        m req, res, next

        sinon.assert.notCalled next
        sinon.assert.calledWith res.send, reply, 200

        sinon.assert.calledOnce starsController.create
        sinon.assert.calledWith starsController.create, body, '5', 'bob'
