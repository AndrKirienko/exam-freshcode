const http = require('http');
require('dotenv').config();
require('./utils/logger');
require('./utils/logBackup');
const controller = require('./socketInit');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);

controller.createConnection(server);
