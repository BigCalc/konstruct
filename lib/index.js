// © 2014 QUILLU INC.
// Export middleware
'use strict';

module.exports = {
  blockHidden: require('./blockHidden'),
  errorLogger: require('./errorLogger'),
  errorHandler: require('./errorHandler'),
  forceLatestIE: require('./forceLatestIE'),
  guestID: require('./guestID'),
  redirect: require('./redirect'),
  requestID: require('./requestID'),
  xrobots: require('./xrobots'),
  errors: require('./errors')
};
