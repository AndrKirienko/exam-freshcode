const { Router } = require('express');
const { chatsController } = require('../controllers');

const chatsRouter = Router();

chatsRouter.get('/getPreview', chatsController.getPreview);

chatsRouter.get('/:interlocutorId', chatsController.getChat);

chatsRouter.post('/newMessage', chatsController.addMessage);

chatsRouter.patch('/blackList', chatsController.blackList);

chatsRouter.patch('/favoriteList', chatsController.favoriteList);

module.exports = chatsRouter;
