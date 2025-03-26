const express = require('express');
const router = express.Router();
const { basic, checkToken, hashPass, validators } = require('../middlewares');
const {
  chatController,
  contestController,
  userController,
} = require('../controllers');
const upload = require('../utils/fileUpload');
const contestsRouter = require('./contestsRouter');
const chatCatalogRoutes = require('./chatCatalogRoutes');
const offersRouter = require('./offersRouter');

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

router.post('/dataForContest', contestController.dataForContest);

router.get('/downloadFile/:fileName', contestController.downloadFile);

router.post('/changeMark', basic.onlyForCustomer, userController.changeMark);

router.post('/updateUser', upload.uploadAvatar, userController.updateUser);

router.post('/cashout', basic.onlyForCreative, userController.cashout);

router.post('/newMessage', chatController.addMessage);

router.post('/getChat', chatController.getChat);

router.post('/getPreview', chatController.getPreview);

router.post('/blackList', chatController.blackList);

router.post('/favorite', chatController.favoriteChat);

module.exports = router;
