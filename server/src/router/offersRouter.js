const { Router } = require('express');
const { offersController } = require('../controllers');
const upload = require('../utils/fileUpload');
const { basic } = require('../middlewares');

const offersRouter = Router();

offersRouter.get(
  '/',
  basic.onlyForModerator,
  offersController.getOffersForModerator
);

offersRouter.patch(
  '/:offerId',
  basic.onlyForModerator,
  offersController.updateOfferModeratorStatus
);

offersRouter.post(
  '/setNewOffer',
  upload.uploadLogoFiles,
  basic.canSendOffer,
  offersController.setNewOffer
);

offersRouter.post(
  '/setOfferStatus',
  basic.onlyForCustomerWhoCreateContest,
  offersController.setOfferStatus
);

module.exports = offersRouter;
