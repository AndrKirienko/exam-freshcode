module.exports = (sequelize, DataTypes) => {
  const CatalogConversation = sequelize.define(
    'CatalogConversation',
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

  CatalogConversation.associate = function (models) {
    CatalogConversation.belongsTo(models.Conversations, {
      foreignKey: 'conversationId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    CatalogConversation.belongsTo(models.Catalogs, {
      foreignKey: 'catalogId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return CatalogConversation;
};
