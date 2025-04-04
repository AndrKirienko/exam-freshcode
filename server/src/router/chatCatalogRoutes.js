const { Router } = require('express');
const { chatController, chatCatalogController } = require('../controllers');

const chatCatalogRoutes = Router();

chatCatalogRoutes.get('/', chatCatalogController.getCatalogs);
chatCatalogRoutes.post('/', chatCatalogController.createCatalog);
chatCatalogRoutes.delete('/:catalogId', chatCatalogController.deleteCatalog);
chatCatalogRoutes.patch('/:catalogId', chatCatalogController.updateNameCatalog);
chatCatalogRoutes.delete(
  '/chats/:catalogId/:chatId',
  chatCatalogController.removeChatFromCatalog
);
chatCatalogRoutes.post('/chats', chatCatalogController.addChatToCatalog);

//chatCatalogRoutes.get('/', chatController.getCatalogs);
//chatCatalogRoutes.post('/', chatController.createCatalog);
//chatCatalogRoutes.delete('/:catalogId', chatController.deleteCatalog);
//chatCatalogRoutes.patch('/:catalogId', chatController.updateNameCatalog);
// chatCatalogRoutes.delete(
//   '/chats/:catalogId/:chatId',
//   chatController.removeChatFromCatalog
// );
//chatCatalogRoutes.post('/chats', chatController.addNewChatToCatalog);

module.exports = chatCatalogRoutes;
