module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'Tokens',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );

  Token.associate = function (models) {
    Token.belongsTo(models.Users, { foreignKey: 'userId' });
  };

  return Token;
};
