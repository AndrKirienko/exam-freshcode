module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Messages',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      sender: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Message.associate = function (models) {
    Message.belongsTo(models.Conversations, {
      foreignKey: 'conversationId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Message.belongsTo(models.Users, {
      foreignKey: 'sender',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  };

  return Message;
};
