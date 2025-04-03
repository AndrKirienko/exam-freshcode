const { Op, Sequelize } = require('sequelize');
const db = require('./../models');
const controller = require('./../socketInit');
const ServerError = require('../errors/ServerError');

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
    body: { recipient: recipientId, messageBody, interlocutor },
  } = req;

  const participants = [sender, recipientId].sort(
    (participant1, participant2) => participant1 - participant2
  );

  try {
    let conversation = await Conversations.findOne({
      attributes: ['id', 'createdAt', 'updatedAt'],
      include: [
        {
          model: ConversationParticipants,
          attributes: ['userId', 'favoriteList'],
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

      raw: true,
    });

    if (!conversation) {
      conversation = await Conversations.create({});
      await ConversationParticipants.bulkCreate([
        { conversationId: conversation.id, userId: participants[0] },
        { conversationId: conversation.id, userId: participants[1] },
      ]);
    }

    const blackLists = await ConversationParticipants.findAll({
      where: {
        conversationId: conversation.id,
        userId: { [Sequelize.Op.in]: participants },
      },
      attributes: ['blackList'],
      raw: true,
    });

    let blackList = false;
    if (blackLists.some(item => item.blackList)) {
      blackList = true;
    }

    let message = null;
    if (!blackList) {
      message = await Messages.create({
        sender,
        body: messageBody,
        conversationId: conversation.id,
      });
    }

    const preview = {
      _id: conversation.id,
      sender,
      text: message ? messageBody : null,
      createAt: message ? message.createdAt : null,
      participants: participants,
      blackList,
      favoriteList:
        conversation['ConversationParticipants.favoriteList'] && false,
    };

    const interlocutorId = participants.find(id => id !== sender);

    controller.getChatController().emitNewMessage(interlocutorId, {
      message: {
        _id: message ? message.id : null,
        sender,
        body: message ? messageBody : null,
        conversation: conversation.id,
        createdAt: message ? message.createdAt : null,
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
        _id: message ? message.id : null,
        sender,
        body: message ? messageBody : null,
        conversation: conversation.id,
        createdAt: message ? message.createdAt : null,
      },
      preview: { ...preview, interlocutor },
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
					(SELECT "body"
					 FROM "Messages"
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
          Sequelize.literal(`
						(SELECT "blackList"
						 FROM "ConversationParticipants"
						 WHERE "conversationId" = "Conversations"."id"
							 AND "userId" = ${userId})
					`),
          'blackList',
        ],
        [
          Sequelize.literal(`
						(SELECT "favoriteList"
						 FROM "ConversationParticipants"
						 WHERE "conversationId" = "Conversations"."id"
							 AND "userId" = ${userId})
					`),
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

module.exports.blackList = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { participants, blackListFlag },
  } = req;

  try {
    const updatedConversation = await ConversationParticipants.update(
      { blackList: blackListFlag },
      {
        where: {
          conversationId: [
            Sequelize.literal(`
            (SELECT "conversationId"
        		 FROM "ConversationParticipants"
         		 WHERE "userId" IN (${participants.join(',')})
         		 GROUP BY "conversationId"
         		 HAVING COUNT(DISTINCT "userId") = ${participants.length})`),
          ],
          userId,
        },
      }
    );

    if (!updatedConversation) {
      return next(new ServerError());
    }

    const findConversation = await Conversations.findOne({
      include: [
        {
          attributes: ['id', 'blackList', 'favoriteList'],
          model: ConversationParticipants,
          where: {
            conversationId: [
              Sequelize.literal(`
            (SELECT "conversationId"
        		 FROM "ConversationParticipants"
         		 WHERE "userId" IN (${participants.join(',')})
         		 GROUP BY "conversationId"
         		 HAVING COUNT(DISTINCT "userId") = ${participants.length})`),
            ],
            userId,
          },
        },
      ],
      raw: true,
    });

    const formattedConversation = {
      _id: findConversation.id,
      participants: participants,
      blackList: findConversation['ConversationParticipants.blackList'],
      createdAt: findConversation.createdAt,
      favoriteList: findConversation['ConversationParticipants.favoriteList'],
      updatedAt: findConversation.updatedAt,
    };

    res.send(formattedConversation);

    const interlocutorId = participants.find(id => id !== userId);
    controller
      .getChatController()
      .emitChangeBlockStatus(interlocutorId, formattedConversation);
  } catch (err) {
    next(err);
  }
};

module.exports.favoriteList = async (req, res, next) => {
  const {
    tokenData: { userId },
    body: { participants, favoriteFlag },
  } = req;

  try {
    const updatedConversation = await ConversationParticipants.update(
      { favoriteList: favoriteFlag },
      {
        where: {
          conversationId: [
            Sequelize.literal(`
            (SELECT "conversationId"
        		 FROM "ConversationParticipants"
         		 WHERE "userId" IN (${participants.join(',')})
         		 GROUP BY "conversationId"
         		 HAVING COUNT(DISTINCT "userId") = ${participants.length})`),
          ],
          userId,
        },
      }
    );

    if (!updatedConversation) {
      return next(new ServerError());
    }

    const findConversation = await Conversations.findOne({
      include: [
        {
          attributes: ['id', 'blackList', 'favoriteList'],
          model: ConversationParticipants,
          where: {
            conversationId: [
              Sequelize.literal(`
            (SELECT "conversationId"
        		 FROM "ConversationParticipants"
         		 WHERE "userId" IN (${participants.join(',')})
         		 GROUP BY "conversationId"
         		 HAVING COUNT(DISTINCT "userId") = ${participants.length})`),
            ],
            userId,
          },
        },
      ],
      raw: true,
    });

    const formattedConversation = {
      _id: findConversation.id,
      participants: participants,
      blackList: findConversation['ConversationParticipants.blackList'],
      createdAt: findConversation.createdAt,
      favoriteList: findConversation['ConversationParticipants.favoriteList'],
      updatedAt: findConversation.updatedAt,
    };

    res.send(formattedConversation);

    const interlocutorId = participants.find(id => id !== userId);
    controller
      .getChatController()
      .emitChangeBlockStatus(interlocutorId, formattedConversation);
  } catch (err) {
    next(err);
  }
};
