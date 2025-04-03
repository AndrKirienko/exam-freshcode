const db = require('./../models');

const {
  Conversations,
  ConversationParticipants,
  Catalogs,
  Messages,
  Users,
  CatalogConversation,
} = db;

module.exports.createCatalog = async (req, res, next) => {
  const {
    body: { catalogName, chatId },
    tokenData: { userId },
  } = req;

  try {
    const createCatalog = await Catalogs.create({
      userId,
      catalogName,
    });

    if (chatId) {
      await CatalogConversation.create({
        catalogId: createCatalog.id,
        conversationId: chatId,
      });
    }

    res.status(201).send(createCatalog);
  } catch (err) {
    next(err);
  }
};
