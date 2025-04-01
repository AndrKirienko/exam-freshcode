module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    'Conversations',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Conversation.associate = function (models) {
    Conversation.hasMany(models.Messages, {
      foreignKey: 'conversationId',
    });
    Conversation.hasMany(models.ConversationParticipants, {
      foreignKey: 'conversationId',
    });
    Conversation.hasMany(models.CatalogConversation, {
      foreignKey: 'conversationId',
    });
  };

  return Conversation;
};
