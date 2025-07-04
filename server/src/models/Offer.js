const {
  OFFER_MODERATOR_STATUS: { PENDING },
} = require('./../constants');
module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define(
    'Offers',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      originalFileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'pending',
      },
      moderatorStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: PENDING,
      },
    },
    {
      timestamps: false,
    }
  );

  Offer.associate = function (models) {
    Offer.belongsTo(models.Users, { foreignKey: 'userId' });
    Offer.belongsTo(models.Contests, { foreignKey: 'contestId' });
    Offer.hasOne(models.Ratings, { foreignKey: 'offerId' });
  };

  return Offer;
};
