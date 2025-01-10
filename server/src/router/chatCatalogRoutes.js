const { Router } = require('express');
const chatController = require('../controllers/chatController');

const chatCatalogRoutes = Router();

chatCatalogRoutes.get('/', chatController.getCatalogs);

chatCatalogRoutes.post('/', chatController.createCatalog);

chatCatalogRoutes.delete('/:catalogId', chatController.deleteCatalog);

chatCatalogRoutes.patch('/:catalogId', chatController.updateNameCatalog);

module.exports = chatCatalogRoutes;
