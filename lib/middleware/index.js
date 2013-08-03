// © 2013 QUILLU INC.
// Export middleware
'use strict';

module.exports = {
  blockHidden: require('./blockHidden'),
  browserify: require('./browserify'),
  errorLogger: require('./errorLogger'),
  errorHandler: require('./errorHandler'),
  forceLatestIE: require('./forceLatestIE'),
  guestID: require('./guestID'),
  less: require('./less'),
  redirect: require('./redirect'),
  requestID: require('./requestID'),
  winstonLogger: require('./winstonLogger'),
  xrobots: require('./xrobots')
};
