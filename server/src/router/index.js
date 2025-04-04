const express = require('express');
const router = express.Router();
const { basic, checkToken, hashPass, validators } = require('../middlewares');
const { contestController, userController } = require('../controllers');
const upload = require('../utils/fileUpload');
const contestsRouter = require('./contestsRouter');
const chatCatalogRoutes = require('./chatsCatalogsRouter');
const offersRouter = require('./offersRouter');
const chatsRouter = require('./chatsRouter');

router.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration
);

router.post('/login', validators.validateLogin, userController.login);

router.post('/getUser', checkToken.checkAuth);

router.use(checkToken.checkToken);

router.use('/contests', contestsRouter);
router.use('/catalogs', chatCatalogRoutes);
router.use('/offers', offersRouter);
router.use('/chats', chatsRouter);

router.post('/dataForContest', contestController.dataForContest);

router.get('/downloadFile/:fileName', contestController.downloadFile);

router.post('/changeMark', basic.onlyForCustomer, userController.changeMark);

router.post('/updateUser', upload.uploadAvatar, userController.updateUser);

router.post('/cashout', basic.onlyForCreative, userController.cashout);

module.exports = router;
