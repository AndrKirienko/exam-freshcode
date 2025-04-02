const { Op, Sequelize } = require('sequelize');
const db = require('./../models');
const controller = require('./../socketInit');

const {
  Conversations,
  ConversationParticipants,
  Catalogs,
  Messages,
  Users,
  CatalogConversation,
} = db;

module.exports.getChat = async (req, res, next) => {
  const {
    tokenData: { userId },
    params: { interlocutorId },
  } = req;

  try {
    const conversation = await Conversations.findOne({
      attributes: ['id'],
      include: [
        {
          model: ConversationParticipants,
          where: {
            userId: {
              [Op.in]: [userId, interlocutorId],
            },
          },
        },
      ],
      where: Sequelize.literal(`
        (SELECT COUNT(DISTINCT "ConversationParticipants"."userId")
        FROM "ConversationParticipants"
        WHERE "ConversationParticipants"."conversationId" = "Conversations"."id"
        AND "ConversationParticipants"."userId" IN (${[
          userId,
          interlocutorId,
        ].join(',')})) = 2
      `),
    });

    const interlocutor = await Users.findOne({
      where: { id: interlocutorId },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    if (!conversation) {
      return res.status(200).send({
        messages: [],
        interlocutor: {
          firstName: interlocutor.firstName,
          lastName: interlocutor.lastName,
          displayName: interlocutor.displayName,
          id: interlocutor.id,
          avatar: interlocutor.avatar,
        },
      });
    }

    const messages = await Messages.findAll({
      attributes: ['id', 'sender', 'body', 'conversationId', 'createdAt'],
      where: {
        conversationId: conversation.id,
      },
      order: [['createdAt', 'ASC']],
    });

    res.status(200).send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.addMessage = async (req, res, next) => {
  const {
    tokenData: { userId: sender },
    body: { recipient: recipientId },
  } = req;

  const participants = [sender, recipientId].sort((a, b) => a - b);

  try {
    let conversation = await Conversations.findOne({
      attributes: ['id', 'createdAt', 'updatedAt'],
      include: [
        {
          model: ConversationParticipants,
          attributes: ['userId'],
          where: {
            userId: { [Op.in]: participants },
          },
        },
      ],
      where: Sequelize.literal(`
        (SELECT COUNT(DISTINCT "ConversationParticipants"."userId")
        FROM "ConversationParticipants"
        WHERE "ConversationParticipants"."conversationId" = "Conversations"."id"
        AND "ConversationParticipants"."userId" IN (${participants.join(
          ','
        )})) = 2
      `),
    });

    if (!conversation) {
      conversation = await Conversations.create({});
      await ConversationParticipants.bulkCreate([
        { conversationId: conversation.id, userId: participants[0] },
        { conversationId: conversation.id, userId: participants[1] },
      ]);
    }

    const message = await Messages.create({
      sender,
      body: req.body.messageBody,
      conversationId: conversation.id,
    });

    const interlocutorId = participants.find(id => id !== sender);

    const preview = {
      _id: conversation.id,
      sender,
      text: req.body.messageBody,
      createAt: message.createdAt,
      participants: participants,
      blackList: [false, false],
      favoriteList: [false, false],
    };

    controller.getChatController().emitNewMessage(interlocutorId, {
      message: {
        _id: message.id,
        sender,
        body: req.body.messageBody,
        conversation: conversation.id,
        createdAt: message.createdAt,
      },
      preview: {
        ...preview,
        interlocutor: {
          id: sender,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      },
    });

    res.send({
      message: {
        _id: message.id,
        sender,
        body: req.body.messageBody,
        conversation: conversation.id,
        createdAt: message.createdAt,
      },
      preview: {
        ...preview,
        interlocutor: req.body.interlocutor,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  const {
    tokenData: { userId },
  } = req;

  try {
    const conversations = await Conversations.findAll({
      attributes: [
        'id',
        [Sequelize.literal('MAX("Messages"."sender")'), 'sender'],
        [
          Sequelize.literal(`
					(SELECT "body" FROM "Messages"
					 WHERE "conversationId" = "Conversations".id
					 ORDER BY "createdAt" DESC LIMIT 1)
			`),
          'text',
        ],
        [Sequelize.literal('MAX("Messages"."createdAt")'), 'createAt'],
        [
          Sequelize.fn(
            'ARRAY_AGG',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('ConversationParticipants.userId')
            )
          ),
          'participants',
        ],
        [
          Sequelize.fn(
            'ARRAY_AGG',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('ConversationParticipants.blackList')
            )
          ),
          'blackList',
        ],
        [
          Sequelize.fn(
            'ARRAY_AGG',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('ConversationParticipants.favoriteList')
            )
          ),
          'favoriteList',
        ],
      ],
      include: [
        {
          model: Messages,
          attributes: [],
          required: true,
        },
        {
          model: ConversationParticipants,
          attributes: [],
          required: true,
        },
      ],
      where: {
        id: {
          [Sequelize.Op.in]: Sequelize.literal(
            `(SELECT "conversationId" FROM "ConversationParticipants" WHERE "userId" = ${userId})`
          ),
        },
      },
      group: ['Conversations.id'],
      order: [[Sequelize.literal('MAX("Messages"."createdAt")'), 'DESC']],
      raw: true,
    });

    const interlocutors = [];

    conversations.forEach(conversation => {
      interlocutors.push(
        conversation.participants.find(
          participant => participant !== req.tokenData.userId
        )
      );
    });

    const senders = await Users.findAll({
      where: {
        id: interlocutors,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    conversations.forEach(conversation => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar,
          };
        }
      });
    });

    res.send(conversations);
  } catch (err) {
    next(err);
  }
};
