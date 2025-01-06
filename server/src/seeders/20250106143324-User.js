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
          firstName: 'buyer',
          lastName: 'buyerov',
          displayName: 'BUYER',
          password: bcrypt.hashSync('Q!werty123456', SALT_ROUNDS),
          email: 'buyer@gmail.com',
          role: CUSTOMER,
        },
        {
          firstName: 'creative',
          lastName: 'creativov',
          displayName: 'CREATIVE',
          password: bcrypt.hashSync('Q!werty123456', SALT_ROUNDS),
          email: 'creative@gmail.com',
          role: CREATOR,
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Users',
      { email: { [Sequelize.Op.or]: ['buyer@gmail.com', 'creative@gmail.com'] } },
      {}
    );
  },
};
