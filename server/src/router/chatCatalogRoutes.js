const { Router } = require('express');
const { chatController } = require('../controllers');

const chatCatalogRoutes = Router();

chatCatalogRoutes.get('/', chatController.getCatalogs);

chatCatalogRoutes.post('/', chatController.createCatalog);

chatCatalogRoutes.post('/chats', chatController.addNewChatToCatalog);

chatCatalogRoutes.patch('/:catalogId', chatController.updateNameCatalog);

chatCatalogRoutes.delete('/:catalogId', chatController.deleteCatalog);

chatCatalogRoutes.delete(
  '/chats/:catalogId/:chatId',
  chatController.removeChatFromCatalog
);

module.exports = chatCatalogRoutes;
