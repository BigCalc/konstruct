// © 2014 QUILLU INC.
// Winston Logger Connect Middleware
'use strict';

var bytes = require('bytes');
var clc = require('cli-color');

var DEFAULT_BUILD = 'prod';
var BUILDS = {
  dev: [
    'method',
    'url',
    'status',
    'responseTime',
    'contentLength'
  ],
  prod: [
    'remoteAddr',
    'date',
    'method',
    'url',
    'httpVersion',
    'status',
    'contentLength',
    'referrer',
    'userAgent',
    'xForwardedFor'
  ]
};

var _fields = {
  remoteAddr: function (req, res) {
    if (req.ip) return req.ip;
    var sock = req.socket;
    if (sock.socket) return sock.socket.remoteAddress;
    return sock.remoteAddress;
  },

  date: function (req, res) {
    return new Date().toUTCString();
  },

  responseTime: function (req, res) {
    return new Date() - req._startTime;
  },

  method: function (req, res) {
    return req.method;
  },

  url: function (req, res) {
    return req.originalUrl || req.url;
  },

  httpVersion: function (req, res) {
    return req.httpVersionMajor + '.' + req.httpVersionMinor;
  },

  status: function (req, res){
    return res.statusCode;
  },

  contentLength: function (req, res){
    var len = parseInt(res.getHeader('Content-Length'), 10);
    return isNaN(len) ? 0 : len;
  },

  referrer: function (req, res) {
    return req.headers['referer'] || req.headers['referrer'];
  },

  userAgent: function (req, res) {
    return req.headers['user-agent'];
  },

  xForwardedFor: function (req, res) {
    return req.headers['x-forwarded-for'];
  }
};

var buildLine = function (meta, useColor) {
  var line = '';

  if (meta.remoteAddr != null) {
    if (useColor) line += clc.xterm(203)(meta.remoteAddr + ' - ');
    else line += meta.remoteAddr + ' - ';
  }

  if (meta.method != null) {
    if (useColor) line += clc.xterm(8)(meta.method + ' ');
    else line += meta.method + ' ';
  }

  if (meta.url != null) {
    if (useColor) line += clc.xterm(214)(meta.url + ' ');
    else line += meta.url + ' ';
  }

  if (meta.status != null) {
    if (useColor){
      if (meta.status >= 500) line += clc.redBright.bold(meta.status);
      else if (meta.status >= 400) line += clc.magentaBright.bold(meta.status);
      else if (meta.status >= 300) line += clc.cyanBright.bold(meta.status);
      else line += clc.green(meta.status);
    } else{
      line += meta.status;
    }
    line += ' ';
  }

  if (meta.responseTime != null) {
    if (useColor) line += clc.xterm(37)(meta.responseTime + 'ms ');
    else line += meta.responseTime + 'ms ';
  }

  if (meta.contentLength != null) {
    if (useColor) line += clc.xterm(62)(bytes(meta.contentLength) + ' ');
    else line += bytes(meta.contentLength) + ' ';
  }

  return line;
};

module.exports = function (winston, options) {
  if (winston == null) return new Error('Need Winston logger instance!');
  if (options == null || typeof options !== 'object') options = {};

  var fields = options.fields;
  if (fields == null || typeof options.build !== 'array'){
    if (options.build != null && typeof options.build === 'string'){
      fields = BUILDS[options.build];
    } else {
      fields = BUILDS[DEFAULT_BUILD];
    }
  }

  return function winstonLogger (req, res, next) {
    if (req.logger != null) return next();
    req.logger = winston.child(req.id ? req.id : _fields.remoteAddr(req));

    if (fields.indexOf('responseTime') >= 0 ) req._startTime = new Date();

    var end = res.end;
    res.end = function (chunk, encoding) {
      res.end = end;
      res.end(chunk, encoding);

      var line,
          meta = {};
      // Populate fields
      fields.forEach(function (field) {
        meta[field] = _fields[field](req, res);
      });

      line = buildLine(meta, options.color);
      if (meta.status >= 500) req.logger.error(line, meta);
      else if (meta.status >= 400) req.logger.warn(line, meta);
      else req.logger.info(line, meta);
    };

    next();
  };
};
