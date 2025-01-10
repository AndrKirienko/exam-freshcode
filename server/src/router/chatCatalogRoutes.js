const { Router } = require('express');
const chatController = require('../controllers/chatController');

const chatCatalogRoutes = Router();

chatCatalogRoutes.get('/', chatController.getCatalogs);

chatCatalogRoutes.post('/', chatController.createCatalog);

module.exports = chatCatalogRoutes;
