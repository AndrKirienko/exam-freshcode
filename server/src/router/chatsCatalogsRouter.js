const { Router } = require('express');
const { chatsCatalogsController } = require('../controllers');

const chatCatalogRoutes = Router();

chatCatalogRoutes.get('/', chatsCatalogsController.getCatalogs);
chatCatalogRoutes.post('/', chatsCatalogsController.createCatalog);
chatCatalogRoutes.delete('/:catalogId', chatsCatalogsController.deleteCatalog);
chatCatalogRoutes.patch(
  '/:catalogId',
  chatsCatalogsController.updateNameCatalog
);
chatCatalogRoutes.delete(
  '/chats/:catalogId/:chatId',
  chatsCatalogsController.removeChatFromCatalog
);
chatCatalogRoutes.post('/chats', chatsCatalogsController.addChatToCatalog);

module.exports = chatCatalogRoutes;
