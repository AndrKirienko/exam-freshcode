module.exports = (sequelize, DataTypes) => {
  const ConversationParticipant = sequelize.define(
    'ConversationsParticipants',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      blackList: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      favoriteList: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );

  ConversationParticipant.associate = function (models) {
    ConversationParticipant.belongsTo(models.Conversations, {
      foreignKey: 'conversationId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    ConversationParticipant.belongsTo(models.Users, {
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  };

  return ConversationParticipant;
};
