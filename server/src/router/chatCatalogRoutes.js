const { Router } = require('express');
const chatController = require('../controllers/chatController');

const chatCatalogRoutes = Router();

chatCatalogRoutes.get('/', chatController.getCatalogs);

module.exports = chatCatalogRoutes;
