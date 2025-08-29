'use strict';
const bcrypt = require('bcrypt');
const {
  SALT_ROUNDS,
  ROLE: { MODERATOR },
} = require('../constants');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'moderator',
        lastName: 'moderatorov',
        displayName: 'MODERATOR',
        password: bcrypt.hashSync('Q!werty123456', SALT_ROUNDS),
        email: 'moderator@gmail.com',
        role: MODERATOR,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'moderator@gmail.com' });
  },
};
