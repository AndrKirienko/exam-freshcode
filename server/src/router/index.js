const express = require('express');
const router = express.Router();
const { basic, checkToken, hashPass, validators } = require('../middlewares');
const { contestController, usersController } = require('../controllers');
const upload = require('../utils/fileUpload');
const contestsRouter = require('./contestsRouter');
const chatCatalogRoutes = require('./chatsCatalogsRouter');
const offersRouter = require('./offersRouter');
const chatsRouter = require('./chatsRouter');

router.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  usersController.registration
);

router.post('/login', validators.validateLogin, usersController.login);

router.get('/getUser', checkToken.checkAuth);

router.use(checkToken.checkToken);

router.use('/contests', contestsRouter);
router.use('/catalogs', chatCatalogRoutes);
router.use('/offers', offersRouter);
router.use('/chats', chatsRouter);

router.post('/dataForContest', contestController.dataForContest);

router.get('/downloadFile/:fileName', contestController.downloadFile);

router.post('/changeMark', basic.onlyForCustomer, usersController.changeMark);

router.patch('/updateUser', upload.uploadAvatar, usersController.updateUser);

router.post('/cashout', basic.onlyForCreative, usersController.cashout);

module.exports = router;
