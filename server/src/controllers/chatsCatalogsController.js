const db = require('../models');
const ServerError = require('../errors/ServerError');

const { Conversations, Catalogs, CatalogsConversations } = db;

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
      await CatalogsConversations.create({
        catalogId: createCatalog.id,
        conversationId: chatId,
      });
    }

    res.status(201).send(createCatalog);
  } catch (err) {
    next(err);
  }
};

const getCatalogsWithChats = async userId => {
  try {
    const findCatalogs = await Catalogs.findAll({
      where: { userId },
      attributes: ['id', 'catalogName'],
      include: {
        model: CatalogsConversations,
        attributes: ['conversationId'],
        include: {
          model: Conversations,
          attributes: ['id'],
        },
        required: false,
      },
    });

    return findCatalogs.map(catalog => {
      const chats = catalog.CatalogsConversations.map(
        conversation => conversation.Conversation.id
      );
      return {
        id: catalog.id,
        catalogName: catalog.catalogName,
        chats,
      };
    });
  } catch (err) {
    console.error(err);
    throw new Error('Error while fetching catalogs with chats');
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  const {
    tokenData: { userId },
  } = req;

  try {
    const catalogs = await getCatalogsWithChats(userId);
    res.status(200).send(catalogs);
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

module.exports.updateNameCatalog = async (req, res, next) => {
  const {
    params: { catalogId: id },
    body: { catalogName },
    tokenData: { userId },
  } = req;

  try {
    const [updatedCount] = await Catalogs.update(
      { catalogName },
      {
        where: {
          userId,
          id,
        },

        returning: true,
        raw: true,
      }
    );

    if (!updatedCount) {
      return next(new ServerError());
    }

    const catalogs = await getCatalogsWithChats(userId);

    const index = catalogs.findIndex(
      catalog => Number(catalog.id) === Number(id)
    );

    res.status(200).send(catalogs[index]);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  const {
    params: { catalogId, chatId },
  } = req;

  try {
    const deleteChatFromCatalog = await CatalogsConversations.destroy({
      where: {
        catalogId,
        conversationId: chatId,
      },
    });

    if (!deleteChatFromCatalog) {
      return next(new ServerError());
    }

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

module.exports.addChatToCatalog = async (req, res, next) => {
  const {
    body: { catalogId, chatId },
    tokenData: { userId },
  } = req;

  try {
    const findCatalog = await Catalogs.findOne({
      where: { id: catalogId, userId },
    });

    if (!findCatalog) {
      return next(new ServerError());
    }

    const existingChat = await CatalogsConversations.findOne({
      where: { catalogId, conversationId: chatId },
    });

    if (existingChat) {
      return res.status(204);
    }

    await CatalogsConversations.create({
      catalogId,
      conversationId: chatId,
    });

    res.status(201).end();
  } catch (err) {
    next(err);
  }
};
