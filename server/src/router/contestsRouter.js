const { Router } = require('express');
const { basic, validators } = require('../middlewares');
const upload = require('../utils/fileUpload');
const { contestController, userController } = require('../controllers');

const contestsRouter = Router();

contestsRouter.post(
  '/',
  basic.onlyForCustomer,
  upload.uploadContestFiles,
  basic.parseBody,
  validators.validateContestCreation,
  userController.payment
);

contestsRouter.get('/', basic.onlyForCreative, contestController.getContests);

contestsRouter.get('/', basic.onlyForModerator);

contestsRouter.get('/byCustomer', contestController.getCustomersContests);

contestsRouter.patch(
  '/:id',
  upload.updateContestFile,
  contestController.updateContest
);

contestsRouter.get(
  '/:id',
  basic.canGetContest,
  contestController.getContestById
);

module.exports = contestsRouter;
