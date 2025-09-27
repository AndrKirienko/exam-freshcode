const jwt = require('jsonwebtoken');
const moment = require('moment');
const path = require('path');
const { v4: uuid } = require('uuid');
const bd = require('../models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');
const CONSTANTS = require('../constants');
const ServerError = require('../errors/ServerError');

const {
  SQUADHELP_BANK_NUMBER,
  SQUADHELP_BANK_CVC,
  SQUADHELP_BANK_EXPIRY,
  STATIC_FOLDER: { AVATARS },
} = CONSTANTS;

const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TIME,
} = process.env;

module.exports.login = async (req, res, next) => {
  try {
    const foundUser = await userQueries.findUser({ email: req.body.email });
    await userQueries.passwordCompare(req.body.password, foundUser.password);
    const user = {
      firstName: foundUser.firstName,
      userId: foundUser.id,
      role: foundUser.role,
      lastName: foundUser.lastName,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
      rating: foundUser.rating,
    };

    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TIME,
    });
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_TIME,
    });

    const tokenData = await bd.Tokens.findOne({
      where: { userId: foundUser.id },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
    }

    const createTokens = await bd.Tokens.create({
      userId: foundUser.id,
      refreshToken,
    });
    if (!createTokens) {
      return res.status(400).json('Token not create');
    }
    const updateUser = await userQueries.updateUser(
      { accessToken },
      foundUser.id
    );
    if (!updateUser) {
      return res.status(400).json('User not update');
    }

    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    res.send({ token: accessToken });
  } catch (err) {
    next(err);
  }
};

module.exports.registration = async (req, res, next) => {
  try {
    const newUser = await userQueries.userCreation(
      Object.assign(req.body, { password: req.hashPass })
    );
    const user = {
      firstName: newUser.firstName,
      userId: newUser.id,
      role: newUser.role,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      displayName: newUser.displayName,
      balance: newUser.balance,
      email: newUser.email,
      rating: newUser.rating,
    };

    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TIME,
    });
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_TIME,
    });

    const tokenData = await bd.Tokens.findOne({
      where: { userId: newUser.id },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
    }

    const createTokens = await bd.Tokens.create({
      userId: newUser.id,
      refreshToken,
    });
    if (!createTokens) {
      return res.status(400).json('Token not create');
    }
    const updateUser = await userQueries.updateUser(
      { accessToken },
      newUser.id
    );
    if (!updateUser) {
      return res.status(400).json('User not update');
    }

    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    res.send({ token: accessToken });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail());
    } else {
      next(err);
    }
  }
};

module.exports.logout = async (req, res, next) => {
  const {
    body: { id: userId },
    cookies: { refreshToken },
  } = req;
  try {
    const deleteToken = await bd.Tokens.destroy({
      where: { userId, refreshToken },
    });

    if (!deleteToken) {
      return next(new ServerError());
    }
    res.clearCookie('refreshToken');
    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

module.exports.refreshToken = async (req, res, next) => {
  const {
    cookies: { refreshToken },
  } = req;

  try {
    if (!refreshToken) {
      return next(new ServerError());
    }
    const userData = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const tokenData = await bd.Tokens.findOne({ where: { refreshToken } });

    if (!userData || !tokenData) {
      return next(new ServerError());
    }
    const foundUser = await userQueries.findUser({ id: userData.userId });
    const user = {
      firstName: foundUser.firstName,
      userId: foundUser.id,
      role: foundUser.role,
      lastName: foundUser.lastName,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
      rating: foundUser.rating,
    };

    const updateAccessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TIME,
    });
    const updateRefreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_TIME,
    });

    if (tokenData) {
      tokenData.refreshToken = updateRefreshToken;
      await tokenData.save();
    }

    const createTokens = await bd.Tokens.update(
      { refreshToken: updateRefreshToken },
      { where: { userId: foundUser.id } }
    );
    if (!createTokens) {
      return res.status(400).json('Token not create');
    }

    const updateUser = await userQueries.updateUser(
      { accessToken: updateAccessToken },
      foundUser.id
    );

    if (!updateUser) {
      return res.status(400).json('User not update');
    }

    res.cookie('refreshToken', updateRefreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    return res.status(200).send({ accessToken: updateAccessToken });
  } catch (err) {
    next(err);
  }
};

function getQuery (offerId, userId, mark, isFirst, transaction) {
  const getCreateQuery = () =>
    ratingQueries.createRating(
      {
        offerId,
        mark,
        userId,
      },
      transaction
    );
  const getUpdateQuery = () =>
    ratingQueries.updateRating({ mark }, { offerId, userId }, transaction);
  return isFirst ? getCreateQuery : getUpdateQuery;
}

module.exports.changeMark = async (req, res, next) => {
  let sum = 0;
  let avg = 0;
  let transaction;
  const { isFirst, offerId, mark, creatorId } = req.body;
  const userId = req.tokenData.userId;
  try {
    transaction = await bd.sequelize.transaction({
      isolationLevel:
        bd.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });
    const query = getQuery(offerId, userId, mark, isFirst, transaction);
    await query();
    const offersArray = await bd.Ratings.findAll({
      include: [
        {
          model: bd.Offers,
          required: true,
          where: { userId: creatorId },
        },
      ],
      transaction,
    });
    for (let i = 0; i < offersArray.length; i++) {
      sum += offersArray[i].dataValues.mark;
    }
    avg = sum / offersArray.length;

    await userQueries.updateUser({ rating: avg }, creatorId, transaction);
    transaction.commit();
    controller.getNotificationController().emitChangeMark(creatorId);
    res.send({ userId: creatorId, rating: avg });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.payment = async (req, res, next) => {
  const {
    body: { cvc, expiry, price, number, contests },
    tokenData: { userId },
  } = req;

  let transaction;
  try {
    transaction = await bd.sequelize.transaction();
    await bankQueries.updateBankBalance(
      {
        balance: bd.sequelize.literal(`
            CASE
            	WHEN "cardNumber"='${number.replace(/ /g, '')}'
								AND "cvc"='${cvc}'
								AND "expiry"='${expiry}'
                	THEN "balance"-${price}
            	WHEN "cardNumber"='${SQUADHELP_BANK_NUMBER}'
								AND "cvc"='${SQUADHELP_BANK_CVC}'
								AND "expiry"='${SQUADHELP_BANK_EXPIRY}'
                	THEN "balance"+${price}
							END
        `),
      },
      {
        cardNumber: {
          [bd.Sequelize.Op.in]: [
            SQUADHELP_BANK_NUMBER,
            number.replace(/ /g, ''),
          ],
        },
      },
      transaction
    );
    const orderId = uuid();
    contests.forEach((contest, index) => {
      const prize =
        index === contests.length - 1
          ? Math.ceil(price / contests.length)
          : Math.floor(price / contests.length);
      contest = Object.assign(contest, {
        status: index === 0 ? 'active' : 'pending',
        userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize,
      });
    });
    await bd.Contests.bulkCreate(contests, transaction);
    transaction.commit();
    res.send();
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.avatar = path.join(AVATARS, req.file.filename);
    }

    const updatedUser = await userQueries.updateUser(
      req.body,
      req.tokenData.userId
    );
    res.send({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      displayName: updatedUser.displayName,
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      balance: updatedUser.balance,
      role: updatedUser.role,
      id: updatedUser.id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  let transaction;
  try {
    transaction = await bd.sequelize.transaction();
    const updatedUser = await userQueries.updateUser(
      { balance: bd.sequelize.literal('balance - ' + req.body.sum) },
      req.tokenData.userId,
      transaction
    );
    await bankQueries.updateBankBalance(
      {
        balance: bd.sequelize.literal(`CASE 
                WHEN "cardNumber"='${req.body.number.replace(
                  / /g,
                  ''
                )}' AND "expiry"='${req.body.expiry}' AND "cvc"='${
          req.body.cvc
        }'
                    THEN "balance"+${req.body.sum}
                WHEN "cardNumber"='${SQUADHELP_BANK_NUMBER}' AND "expiry"='${SQUADHELP_BANK_EXPIRY}' AND "cvc"='${SQUADHELP_BANK_CVC}'
                    THEN "balance"-${req.body.sum}
                 END
                `),
      },
      {
        cardNumber: {
          [bd.Sequelize.Op.in]: [
            SQUADHELP_BANK_NUMBER,
            req.body.number.replace(/ /g, ''),
          ],
        },
      },
      transaction
    );
    transaction.commit();
    res.send({ balance: updatedUser.balance });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};
