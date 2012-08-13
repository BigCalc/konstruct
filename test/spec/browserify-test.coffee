{ vows, should, sinon } = require 'testthings'
bConf =
  "useCache": false,
  "useMinifier": false,
  "opts":
    "mount": "/js/script",
    "watch": false,
    "cache": false,
    "ignore":  [
      "templates",
      "seq",
      "child_process"
    ],
    "require": [
    ]
fileify =
  "name": "templates",
  "dir": "app/client/templates",
  "opts":
    "extension": ".ejs",
    "removeExtension": true,
    "watch": false
uglify =
  "unsafe": true


browserifyFactory = require '../../../../app/server/support/browserifyFactory'

vows.describe('browserifyFactory').addBatch(
  'when browserfiyFactory is mixedin':
    topic: () -> browserifyFactory
    'it should form an environment closure': (mod) ->
      mod.should.be.a 'function'

    'it should return a bundle and a helper': (mod) ->

      getStub = sinon.stub()
      getStub.withArgs('browserify').returns(bConf)
      getStub.withArgs('fileify').returns(fileify)
      getStub.withArgs('uglify').returns(uglify)

      conf =
        get : getStub

      {bundle, helper} = mod(conf)
      bundle.should.be.a 'function'
      helper.should.exist

).export module
