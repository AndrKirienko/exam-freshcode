const { Router } = require('express');
const { chatControllerSQL } = require('../controllers');

const chatsRouter = Router();

chatsRouter.get('/getPreview', chatControllerSQL.getPreview);

chatsRouter.get('/:interlocutorId', chatControllerSQL.getChat);

chatsRouter.post('/newMessage', chatControllerSQL.addMessage);

chatsRouter.patch('/blackList', chatControllerSQL.blackList);

module.exports = chatsRouter;
