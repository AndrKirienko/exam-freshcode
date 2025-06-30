'use strict';
const bcrypt = require('bcrypt');
const {
  SALT_ROUNDS,
  ROLE: { CUSTOMER, CREATOR },
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'customer',
          lastName: 'customerov',
          displayName: 'CUSTOMER',
          password: bcrypt.hashSync('Q!werty123456', SALT_ROUNDS),
          email: 'customer@gmail.com',
          role: CUSTOMER,
        },
        {
          firstName: 'creator',
          lastName: 'creatorov',
          displayName: 'CREATOR',
          password: bcrypt.hashSync('Q!werty123456', SALT_ROUNDS),
          email: 'creator@gmail.com',
          role: CREATOR,
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Users',
      {
        email: {
          [Sequelize.Op.or]: ['customer@gmail.com', 'creator@gmail.com'],
        },
      },
      {}
    );
  },
};
