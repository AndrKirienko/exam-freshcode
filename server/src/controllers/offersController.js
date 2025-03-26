const db = require('../models');
const CONSTANTS = require('../constants');
const contestQueries = require('./queries/contestQueries');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const ServerError = require('../errors/ServerError');
const { sendMail } = require('../../services/sendEmail');

const { Offers, Contests, Users } = db;

const {
  LOGO_CONTEST,
  OFFER_STATUS_REJECTED,
  CONTEST_STATUS_FINISHED,
  CONTEST_STATUS_ACTIVE,
  CONTEST_STATUS_PENDING,
  OFFER_STATUS_WON,
  OFFER_MODERATOR_STATUS: { PENDING },
} = CONSTANTS;

module.exports.getOffersForModerator = async (req, res, next) => {
  try {
    const {
      pagination: { limit, offset },
    } = req;

    const foundOffers = await Offers.findAll({
      where: { moderatorStatus: PENDING },
      attributes: ['id', 'text'],
      include: [
        {
          model: Contests,
          attributes: ['title', 'originalFileName'],
          where: { status: CONTEST_STATUS_ACTIVE },
          include: [
            {
              model: Users,
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
      ],
      raw: true,
      order: [['id', 'DESC']],
      limit: limit + 1,
      offset,
    });

    res.status(200).send({ data: foundOffers });
  } catch (err) {
    next(err);
  }
};

module.exports.updateOfferModeratorStatus = async (req, res, next) => {
  const {
    body: { moderatorStatus },
    params: { offerId },
  } = req;

  try {
    const [updatedCount, updatedOffer] = await Offers.update(
      { moderatorStatus },
      {
        where: { id: offerId },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      return next(new ServerError('Offer not found or not updated'));
    }

    res.status(200).send({ data: updatedOffer });
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.sendMessageOfferStatus = async (req, res, next) => {
  try {
    const {
      params: { offerId },
    } = req;

    const foundData = await Offers.findByPk(offerId, {
      attributes: ['moderatorStatus', 'text'],
      include: [
        { model: Users, attributes: ['firstName', 'lastName', 'email'] },
        { model: Contests, attributes: ['title'] },
      ],
    });

    if (!foundData) {
      return console.log('Offer not found');
    }

    const responseData = {
      moderatorStatus: foundData.moderatorStatus,
      text: foundData.text,
      user: foundData.User
        ? {
            firstName: foundData.User.firstName,
            lastName: foundData.User.lastName,
            email: foundData.User.email,
          }
        : null,
      contest: foundData.Contest
        ? {
            title: foundData.Contest.title,
          }
        : null,
    };
    sendMail(responseData);
  } catch (err) {
    console.log(err);
  }
};

module.exports.setNewOffer = async (req, res, next) => {
  const obj = {};
  if (req.body.contestType === LOGO_CONTEST) {
    obj.fileName = req.file.filename;
    obj.originalFileName = req.file.originalname;
  } else {
    obj.text = req.body.offerData;
  }
  obj.userId = req.tokenData.userId;
  obj.contestId = req.body.contestId;
  try {
    const result = await contestQueries.createOffer(obj);
    delete result.contestId;
    delete result.userId;
    controller
      .getNotificationController()
      .emitEntryCreated(req.body.customerId);
    const User = Object.assign({}, req.tokenData, { id: req.tokenData.userId });
    res.send(Object.assign({}, result, { User }));
  } catch (e) {
    return next(new ServerError());
  }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejectedOffer = await contestQueries.updateOffer(
    { status: OFFER_STATUS_REJECTED },
    { id: offerId }
  );
  controller
    .getNotificationController()
    .emitChangeOfferStatus(
      creatorId,
      'Someone of yours offers was rejected',
      contestId
    );
  return rejectedOffer;
};

const resolveOffer = async (
  contestId,
  creatorId,
  orderId,
  offerId,
  priority,
  transaction
) => {
  const finishedContest = await contestQueries.updateContestStatus(
    {
      status: db.sequelize.literal(`   CASE
            WHEN "id"=${contestId}  AND "orderId"='${orderId}' THEN '${CONTEST_STATUS_FINISHED}'
            WHEN "orderId"='${orderId}' AND "priority"=${
        priority + 1
      }  THEN '${CONTEST_STATUS_ACTIVE}'
            ELSE '${CONTEST_STATUS_PENDING}'
            END
    `),
    },
    { orderId },
    transaction
  );
  await userQueries.updateUser(
    { balance: db.sequelize.literal('balance + ' + finishedContest.prize) },
    creatorId,
    transaction
  );
  const updatedOffers = await contestQueries.updateOfferStatus(
    {
      status: db.sequelize.literal(` CASE
            WHEN "id"=${offerId} THEN '${OFFER_STATUS_WON}'
            ELSE '${OFFER_STATUS_REJECTED}'
            END
    `),
    },
    {
      contestId,
    },
    transaction
  );
  transaction.commit();
  const arrayRoomsId = [];
  updatedOffers.forEach(offer => {
    if (offer.status === OFFER_STATUS_REJECTED && creatorId !== offer.userId) {
      arrayRoomsId.push(offer.userId);
    }
  });
  controller
    .getNotificationController()
    .emitChangeOfferStatus(
      arrayRoomsId,
      'Someone of yours offers was rejected',
      contestId
    );
  controller
    .getNotificationController()
    .emitChangeOfferStatus(creatorId, 'Someone of your offers WIN', contestId);
  return updatedOffers[0].dataValues;
};

module.exports.setOfferStatus = async (req, res, next) => {
  let transaction;
  if (req.body.command === 'reject') {
    try {
      const offer = await rejectOffer(
        req.body.offerId,
        req.body.creatorId,
        req.body.contestId
      );
      res.send(offer);
    } catch (err) {
      next(err);
    }
  } else if (req.body.command === 'resolve') {
    try {
      transaction = await db.sequelize.transaction();
      const winningOffer = await resolveOffer(
        req.body.contestId,
        req.body.creatorId,
        req.body.orderId,
        req.body.offerId,
        req.body.priority,
        transaction
      );
      res.send(winningOffer);
    } catch (err) {
      transaction.rollback();
      next(err);
    }
  }
};
