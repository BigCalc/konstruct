// © 2013 QUILLU INC.
// xrobots middleware
// Apply the X-Robots tag to stop crawlers indexing
// https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag
// all: There are no restrictions for indexing or serving.
//  Note: this directive is the default value and has no effect if explicitly listed.
// noindex: Do not show this page in search results and do not show a "Cached" link in search results.
// nofollow:  Do not follow the links on this page
// none:  Equivalent to noindex, nofollow
// noarchive: Do not show a "Cached" link in search results.
// nosnippet: Do not show a snippet in the search results for this page
// noodp: Do not use metadata from the Open Directory project for titles or snippets shown for this page.
// notranslate: Do not offer translation of this page in search results.
// noimageindex:  Do not index images on this page.
// unavailable_after: [RFC-850 date/time]  Do not show this page in search results after the specified date/time.
//  The date/time must be specified in the RFC 850 format.
'use strict';

module.exports = function createXRobot (xrobot) {

  return function xrobots (req, res, next) {
    var existing = res.getHeader('X-Robots-Tag');
    if (existing != null) {
      res.setHeader('X-Robots-Tag', existing + ', ' + xrobot);
    } else {
      res.setHeader('X-Robots-Tag', xrobot);
    }
    next();
  };
};

exports.xrobots = ['all', 'noindex', 'nofollow', 'none',
                  'noarchive', 'nosnippet', 'noodp',
                  'notranslate', 'noimageindex',
                  'unavailable_after'];
