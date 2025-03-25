const {
  OFFER_MODERATOR_STATUS: { PENDING },
} = require('../constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Offers', 'moderatorStatus', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: PENDING,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Offers', 'moderatorStatus');
  },
};
