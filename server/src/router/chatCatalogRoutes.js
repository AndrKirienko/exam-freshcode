const { Router } = require('express');
const chatController = require('../controllers/chatController');

const chatCatalogRoutes = Router();

chatCatalogRoutes.get('/', chatController.getCatalogs);

chatCatalogRoutes.post('/', chatController.createCatalog);

chatCatalogRoutes.patch('/:catalogId', chatController.updateNameCatalog);

chatCatalogRoutes.delete('/:catalogId', chatController.deleteCatalog);

chatCatalogRoutes.delete(
  '/:catalogId/:chatId',
  chatController.removeChatFromCatalog
);

module.exports = chatCatalogRoutes;
