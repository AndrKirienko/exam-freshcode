const db = require('./../models');
const ServerError = require('../errors/ServerError');

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

module.exports.getCatalogs = async (req, res, next) => {
  const {
    tokenData: { userId },
  } = req;

  try {
    const findCatalogs = await Catalogs.findAll({
      where: { userId },
      attributes: ['id', 'catalogName'],
    });

    const catalogIds = findCatalogs.map(c => c.id);
    const findCatalogConversation = await CatalogConversation.findAll({
      where: { catalogId: catalogIds },
      attributes: ['catalogId', 'conversationId'],
    });

    const chatMap = {};
    findCatalogConversation.forEach(({ catalogId, conversationId }) => {
      if (!chatMap[catalogId]) chatMap[catalogId] = [];
      chatMap[catalogId].push(conversationId);
    });

    const result = findCatalogs.map(catalog => ({
      id: catalog.id,
      catalogName: catalog.catalogName,
      chats: chatMap[catalog.id] || [],
    }));

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  const {
    params: { catalogId: id },
    tokenData: { userId },
  } = req;

  try {
    const deletedCatalog = await Catalogs.destroy({ where: { id, userId } });

    if (!deletedCatalog) {
      return next(new ServerError());
    }

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};
