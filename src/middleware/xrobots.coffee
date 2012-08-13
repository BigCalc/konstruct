# Apply the X-Robots tag to stop crawlers indexing
# http://code.google.com/web/controlcrawlindex/docs/robots_meta_tag.html

# all: There are no restrictions for indexing or serving. Note: this directive is the default value and has no effect if explicitly listed.
# noindex: Do not show this page in search results and do not show a "Cached" link in search results.
# nofollow:  Do not follow the links on this page
# none:  Equivalent to noindex, nofollow
# noarchive: Do not show a "Cached" link in search results.
# nosnippet: Do not show a snippet in the search results for this page
# noodp: Do not use metadata from the Open Directory project for titles or snippets shown for this page.
# notranslate: Do not offer translation of this page in search results.
# noimageindex:  Do not index images on this page.
# unavailable_after: [RFC-850 date/time]  Do not show this page in search results after the specified date/time. The date/time must be specified in the RFC 850 format.

createXRobot = (xrobot) ->
  (req, res, next) ->
    existing  = res.getHeader('X-Robots-Tag')
    if existing?
      parts = existing.split ','
      parts.push xrobot
      res.setHeader 'X-Robots-Tag', parts
    else
      res.setHeader 'X-Robots-Tag', xrobot
    
    next()


module.exports = 
  noIndex: createXRobot 'noindex'
  noFollow: createXRobot 'nofollow'
  none: createXRobot 'none'
  noArchive: createXRobot 'noArchive'
  noSnippet: createXRobot 'noSnippet'
  noOdp: createXRobot 'noodp'
  noTranslate: createXRobot 'noTranslate'
  noImageIndex: createXRobot 'noimageindex'
  unavailiableAfter: (date) -> createXRobot "unavailable_after:#{date.toUTCString()}"