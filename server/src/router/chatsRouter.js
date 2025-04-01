const { Router } = require('express');
const { chatControllerSQL } = require('../controllers');

const chatsRouter = Router();

chatsRouter.get('/:interlocutorId', chatControllerSQL.getChat);
//chatsRouter.post('/', chatControllerSQL.getChat);

module.exports = chatsRouter;
