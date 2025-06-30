module.exports = (sequelize, DataTypes) => {
  const CatalogsConversations = sequelize.define(
    'CatalogsConversations',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      catalogId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  CatalogsConversations.associate = function (models) {
    CatalogsConversations.belongsTo(models.Conversations, {
      foreignKey: 'conversationId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    CatalogsConversations.belongsTo(models.Catalogs, {
      foreignKey: 'catalogId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return CatalogsConversations;
};
