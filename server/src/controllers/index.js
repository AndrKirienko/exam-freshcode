const { wrapAsync } = require('./../utils/logger');

module.exports.contestController = wrapAsync(require('./contestController'));
module.exports.usersController = wrapAsync(require('./usersController'));
module.exports.offersController = wrapAsync(require('./offersController'));
module.exports.chatsController = wrapAsync(require('./chatsController'));
module.exports.chatsCatalogsController = wrapAsync(
  require('./chatsCatalogsController')
);
