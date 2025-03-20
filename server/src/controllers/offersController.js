const { Offers } = require('../models');

module.exports.getOffersForModerator = async (req, res, next) => {
  try {
    const { status } = req.query;
    console.log(status);

    const foundOffers = await Offers.findAll({
      where: { status },
      //attributes: ['id', 'text', 'status'],
      raw: true,
    });
    res.status(400).send({ data: foundOffers });
  } catch (err) {
    next(err);
  }
};
