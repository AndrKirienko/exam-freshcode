const { wrapAsync } = require('./../utils/logger');

module.exports.chatController = wrapAsync(require('./chatController'));
module.exports.contestController = wrapAsync(require('./contestController'));
module.exports.userController = wrapAsync(require('./userController'));
module.exports.offersController = wrapAsync(require('./offersController'));
module.exports.chatControllerSQL = wrapAsync(require('./chatControllersql'));
