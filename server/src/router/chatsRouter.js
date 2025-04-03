const { Router } = require('express');
const { chatControllerSQL } = require('../controllers');

const chatsRouter = Router();

chatsRouter.get('/getPreview', chatControllerSQL.getPreview);

chatsRouter.get('/:interlocutorId', chatControllerSQL.getChat);

chatsRouter.post('/newMessage', chatControllerSQL.addMessage);

chatsRouter.patch('/blackList', chatControllerSQL.blackList);

chatsRouter.patch('/favoriteList', chatControllerSQL.favoriteList);

module.exports = chatsRouter;
