module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE 'moderator';
    `);
  },

  down: async (queryInterface, Sequelize) => {},
};
