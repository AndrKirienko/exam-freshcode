const path = require('path');
const mongoose = require('mongoose');
const { logError } = require('../../utils/logger');
const configPath = path.join(
  __dirname,
  '..',
  '..',
  'config',
  'mongoConfig.json'
);
const env = process.env.NODE_ENV || 'development';
const config = require(configPath)[env];

mongoose
  .connect(`mongodb://${config.host}:${config.port}/${config.database}`)
  .then(() => console.log(`Connection to DB <<< ${config.database} >>> is Ok`))
  .catch(err => console.log(err));

mongoose.connection.on('error', error => {
  logError(error, 500);
});

mongoose.set('debug', env === 'development');

const db = {};
db.Catalog = require('./Catalog');
db.Conversation = require('./Conversation');
db.Message = require('./Message');
db.mongoose = mongoose;

module.exports = db;
