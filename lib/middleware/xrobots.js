// © 2013 QUILLU INC.
// xrobots middleware
// Apply the X-Robots tag to stop crawlers indexing
// https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag
'use strict';

var createXRobot = function(xrobot) {
  return function(req, res, next) {
    var existing = res.getHeader('X-Robots-Tag');
    if (existing != null) {
      res.setHeader('X-Robots-Tag', existing + ', ' + xrobot);
    } else {
      res.setHeader('X-Robots-Tag', xrobot);
    }
    next();
  };
};

module.exports = {
// all: There are no restrictions for indexing or serving. Note: this directive is the default value and has no effect if explicitly listed.
  all: createXRobot('all'),
// noindex: Do not show this page in search results and do not show a "Cached" link in search results.
  noindex: createXRobot('noindex'),
// nofollow:  Do not follow the links on this page
  nofollow: createXRobot('nofollow'),
// none:  Equivalent to noindex, nofollow
  none: createXRobot('none'),
// noarchive: Do not show a "Cached" link in search results.
  noarchive: createXRobot('noarchive'),
// nosnippet: Do not show a snippet in the search results for this page
  nosnippet: createXRobot('nosnippet'),
// noodp: Do not use metadata from the Open Directory project for titles or snippets shown for this page.
  noodp: createXRobot('noodp'),
// notranslate: Do not offer translation of this page in search results.
  notranslate: createXRobot('notranslate'),
// noimageindex:  Do not index images on this page.
  noimageindex: createXRobot('noimageindex'),
// unavailable_after: [RFC-850 date/time]  Do not show this page in search results after the specified date/time. The date/time must be specified in the RFC 850 format.
  unavailableAfter: function(date) {
    return createXRobot('unavailable_after: '  + (date.toUTCString()));
  }
};
