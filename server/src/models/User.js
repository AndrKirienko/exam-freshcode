const {
  ROLE: { CUSTOMER, CREATOR, MODERATOR },
} = require('../constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'Users',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'anon.png',
      },
      role: {
        type: DataTypes.ENUM(CUSTOMER, CREATOR, MODERATOR),
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Offers, { foreignKey: 'userId' });
    User.hasMany(models.Contests, { foreignKey: 'userId' });
    User.hasMany(models.Ratings, { foreignKey: 'userId' });
    User.hasMany(models.ConversationsParticipants, { foreignKey: 'userId' });
    User.hasMany(models.Messages, { foreignKey: 'sender' });
    User.hasMany(models.Catalogs, { foreignKey: 'userId' });
  };

  return User;
};
