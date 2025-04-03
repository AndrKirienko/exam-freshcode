const { Router } = require('express');
const { chatController, chatCatalogController } = require('../controllers');

const chatCatalogRoutes = Router();

chatCatalogRoutes.get('/', chatCatalogController.getCatalogs);
chatCatalogRoutes.post('/', chatCatalogController.createCatalog);
chatCatalogRoutes.delete('/:catalogId', chatCatalogController.deleteCatalog);

//chatCatalogRoutes.get('/', chatController.getCatalogs);
//chatCatalogRoutes.post('/', chatController.createCatalog);
//chatCatalogRoutes.delete('/:catalogId', chatController.deleteCatalog);

chatCatalogRoutes.post('/chats', chatController.addNewChatToCatalog);

chatCatalogRoutes.patch('/:catalogId', chatController.updateNameCatalog);

chatCatalogRoutes.delete(
  '/chats/:catalogId/:chatId',
  chatController.removeChatFromCatalog
);

module.exports = chatCatalogRoutes;
