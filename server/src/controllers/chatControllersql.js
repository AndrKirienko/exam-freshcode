const { Op } = require('sequelize');
const db = require('./../models');

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
    const messages = await Messages.findAll({
      attributes: ['id', 'senderId', 'body', 'conversationId', 'createdAt'],
      include: [
        {
          model: Conversations,
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
        },
      ],
      where: {
        '$Conversation.ConversationParticipants.userId$': {
          [Op.in]: [userId, interlocutorId],
        },
      },
      order: [['createdAt', 'ASC']],
    });

    const interlocutor = await Users.findOne({
      where: { id: interlocutorId },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    if (!interlocutor) {
      return res.status(404).send({ message: 'Interlocutor not found' });
    }

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
