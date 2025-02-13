const cors = require('cors');
const express = require('express');
const router = require('./router');
const handlerError = require('./handlerError/handler');
const { errors } = require('../middlewares');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use(router);
app.use(handlerError);

app.use(errors);

module.exports = app;
