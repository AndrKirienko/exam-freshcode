require('dotenv').config();

const {
  DB_USERNAME,
  DB_DIALECT,
  DB_PASSWORD_DEV,
  DB_NAME_DEV,
  DB_HOST_DEV,
  DB_PASSWORD_TEST,
  DB_NAME_TEST,
  DB_HOST_TEST,
  DB_PASSWORD_PROD,
  DB_NAME_PROD,
  DB_HOST_PROD,
} = process.env;

const config = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD_DEV,
    database: DB_NAME_DEV,
    host: DB_HOST_DEV,
    dialect: DB_DIALECT,
    operatorsAliases: 'Op',
    seederStorage: 'sequelize',
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD_TEST,
    database: DB_NAME_TEST,
    host: DB_HOST_TEST,
    dialect: DB_DIALECT,
    operatorsAliases: 'Op',
    seederStorage: 'sequelize',
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD_PROD,
    database: DB_NAME_PROD,
    host: DB_HOST_PROD,
    dialect: DB_DIALECT,
    operatorsAliases: 'Op',
    seederStorage: 'sequelize',
  },
};

module.exports = config;
