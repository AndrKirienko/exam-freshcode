const { Router } = require('express');
const { chatController, chatCatalogController } = require('../controllers');

const chatCatalogRoutes = Router();

chatCatalogRoutes.get('/', chatCatalogController.getCatalogs);
chatCatalogRoutes.post('/', chatCatalogController.createCatalog);
chatCatalogRoutes.delete('/:catalogId', chatCatalogController.deleteCatalog);
chatCatalogRoutes.patch('/:catalogId', chatCatalogController.updateNameCatalog);

//chatCatalogRoutes.get('/', chatController.getCatalogs);
//chatCatalogRoutes.post('/', chatController.createCatalog);
//chatCatalogRoutes.delete('/:catalogId', chatController.deleteCatalog);
//chatCatalogRoutes.patch('/:catalogId', chatController.updateNameCatalog);

chatCatalogRoutes.post('/chats', chatController.addNewChatToCatalog);

chatCatalogRoutes.delete(
  '/chats/:catalogId/:chatId',
  chatController.removeChatFromCatalog
);

module.exports = chatCatalogRoutes;
