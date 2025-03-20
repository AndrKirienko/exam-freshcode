const { Router } = require('express');
const { offersController, contestController } = require('../controllers');
const upload = require('../utils/fileUpload');
const { basic } = require('../middlewares');

const offersRouter = Router();

offersRouter.get('/', offersController.getOffersForModerator);

offersRouter.post(
  '/setNewOffer',
  upload.uploadLogoFiles,
  basic.canSendOffer,
  contestController.setNewOffer
);

offersRouter.post(
  '/setOfferStatus',
  basic.onlyForCustomerWhoCreateContest,
  contestController.setOfferStatus
);

module.exports = offersRouter;
