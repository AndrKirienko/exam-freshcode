module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CatalogsConversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      catalogId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Catalogs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      conversationId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Conversations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CatalogsConversations');
  },
};
