const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const queryParser = require('query-parser-express');
const router = require('./router');
const handlerError = require('./handlerError/handler');
const { STATIC_PATH } = require('./constants');

const FRONT_PORT = process.env.FRONT_PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const app = express();

app.use(cookieParser());
app.use(cors({ origin: `http://${HOST}:${FRONT_PORT}`, credentials: true }));
app.use(express.json());
app.use(
  queryParser({
    parseNumber: true,
  })
);
app.use('/public', express.static(STATIC_PATH));
app.use(router);

app.use(handlerError);

module.exports = app;
