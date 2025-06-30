const cors = require('cors');
const express = require('express');
const queryParser = require('query-parser-express');
const router = require('./router');
const handlerError = require('./handlerError/handler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  queryParser({
    parseNumber: true,
  })
);
app.use('/public', express.static('public'));
app.use(router);

app.use(handlerError);

module.exports = app;
