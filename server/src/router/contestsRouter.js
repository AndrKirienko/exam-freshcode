const { Router } = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const checkToken = require('../middlewares/checkToken');
const upload = require('../utils/fileUpload');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');

const contestsRouter = Router();

contestsRouter.post(
  '/',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userController.payment
);

contestsRouter.get(
  '/:id',
  checkToken.checkToken,
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

module.exports = contestsRouter;
