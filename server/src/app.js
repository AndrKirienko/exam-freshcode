const cors = require('cors');
const express = require('express');
const queryParser = require('query-parser-express');
const router = require('./router');
const handlerError = require('./handlerError/handler');
const { STATIC_PATH } = require('./constants');

const app = express();

app.use(cors());
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
