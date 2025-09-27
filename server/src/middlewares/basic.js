const path = require('path');
const bd = require('../models');
const RightsError = require('../errors/RightsError');
const ServerError = require('../errors/ServerError');
const CONSTANTS = require('../constants');

const {
  ROLE: { CUSTOMER, CREATOR, MODERATOR },
  CONTEST_STATUS_ACTIVE,
  CONTEST_STATUS_FINISHED,
  STATIC_FOLDER: { CONTESTS },
} = CONSTANTS;

module.exports.parseBody = (req, res, next) => {
  req.body.contests = JSON.parse(req.body.contests);
  for (let i = 0; i < req.body.contests.length; i++) {
    if (req.body.contests[i].haveFile) {
      const file = req.files.splice(0, 1);
      req.body.contests[i].fileName = path.join(CONTESTS, file[0].filename);
      req.body.contests[i].originalFileName = file[0].originalname;
    }
  }
  next();
};

module.exports.canGetContest = async (req, res, next) => {
  const {
    params: { id },
    tokenData: { userId, role },
  } = req;

  let result = null;

  try {
    if (role === CUSTOMER) {
      result = await bd.Contests.findOne({
        where: { id, userId },
      });
    } else if (role === CREATOR) {
      result = await bd.Contests.findOne({
        where: {
          id,
          status: {
            [bd.Sequelize.Op.or]: [
              CONTEST_STATUS_ACTIVE,
              CONTEST_STATUS_FINISHED,
            ],
          },
        },
      });
    }
    result ? next() : next(new RightsError());
  } catch (e) {
    next(new ServerError(e));
  }
};

const checkRole = (allowedRole, errorMessage) => (req, res, next) => {
  if (req.tokenData.role !== allowedRole) {
    return next(new RightsError(errorMessage));
  }
  next();
};

module.exports.onlyForCreative = checkRole(
  CREATOR,
  'This page is only for creatives'
);

module.exports.onlyForCustomer = checkRole(
  CUSTOMER,
  'This page is only for customers'
);

module.exports.onlyForModerator = checkRole(
  MODERATOR,
  'This page is only for moderator'
);

module.exports.canSendOffer = async (req, res, next) => {
  if (req.tokenData.role === CUSTOMER) {
    return next(new RightsError());
  }
  try {
    const result = await bd.Contests.findOne({
      where: {
        id: req.body.contestId,
      },
      attributes: ['status'],
    });
    if (
      result.get({ plain: true }).status === CONSTANTS.CONTEST_STATUS_ACTIVE
    ) {
      next();
    } else {
      return next(new RightsError());
    }
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.onlyForCustomerWhoCreateContest = async (req, res, next) => {
  try {
    const result = await bd.Contests.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: CONSTANTS.CONTEST_STATUS_ACTIVE,
      },
    });
    if (!result) {
      return next(new RightsError());
    }
    next();
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.canUpdateContest = async (req, res, next) => {
  try {
    const result = bd.Contests.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: { [bd.Sequelize.Op.not]: CONSTANTS.CONTEST_STATUS_FINISHED },
      },
    });
    if (!result) {
      return next(new RightsError());
    }
    next();
  } catch (e) {
    next(new ServerError());
  }
};
