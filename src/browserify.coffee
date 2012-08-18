{path, fs, util} = require 'things'
browserify = require 'browserify'
uglify = require 'uglify-js'
{minify} =  require 'html-minifier'
marked =  require 'marked'
jade = require 'jade'

createBrowserify = (conf, clientConf, filters = []) ->
  bundle = browserify conf.opts
  filters.map (f) -> bundle.register f.ext, f.fn

  bundle.ignore conf.ignore if conf.ignore

  # client = JSON.stringify(clientConf).replace(/\"/g, '\\"')
  # bundle.append "require.define('conf',Function(['require','module','exports','__dirname','__filename','process'],\"module.exports = #{client}\"));"
  bundle.prepend "conf = #{JSON.stringify(clientConf)};"

  bundle.addEntry conf.entry if conf.entry

  if conf.opts.watch
    bundle.on 'bundle', ->
      console.log "New Bundle created: #{bundle.modified}"

  bundle

createUglify = (opts) ->
  ext: 'post'
  fn: (body) ->
    jsp = uglify.parser
    pro = uglify.uglify

    ast = jsp.parse body # parse code and get the initial AST
    ast = pro.ast_mangle ast, opts # get a new AST with mangled names
    ast = pro.ast_squeeze ast, opts # get an AST with compression optimizations
    ast = pro.ast_squeeze_more ast, opts if opts.unsafe #Use unsafe compressions
    pro.gen_code ast # return code

createHTML = (conf) ->
  fn = (body) ->
    "module.exports = #{JSON.stringify(body)}"

  fnMinify = (body) ->
    min = minify body, conf.minify
    "module.exports = #{JSON.stringify(min)}"

  ext: '.html'
  fn: if conf then fnMinify else fn

createJade = (conf) ->
  fn = (body) ->
    jadefn = jade.compile body, conf.jade
    "module.exports = #{JSON.stringify(jadefn())}"

  fnMinify = (body) ->
    # console.log body
    jadefn = jade.compile body, conf.jade
    min = minify jadefn(), conf.minify
    "module.exports = #{JSON.stringify(min)}"

  ext: '.jade'
  fn: if conf then fnMinify else fn


createMarkedDown = (conf) ->
  fn = (body) ->
    md = marked body
    "module.exports = #{JSON.stringify(md)}"

  fnMinify = (body) ->
    md =  marked body
    min = minify md, conf.minify
    "module.exports = #{JSON.stringify(min)}"

  ext: '.md'
  fn: if conf then fnMinify else fn

# Public
module.exports = (conf, clientConf) ->
  filters = [createHTML(conf),
              createMarkedDown(conf),
              createJade(conf)
  ]

  if conf.uglify?
    filters.push createUglify conf.uglify

  createBrowserify conf, clientConf, filters
