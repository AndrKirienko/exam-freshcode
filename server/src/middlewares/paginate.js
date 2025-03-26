const {
  RESULTS_VALIDATION_SCHEMA,
  PAGE_VALIDATION_SCHEMA,
} = require('../utils/schemas/validationSchemas');
const CONSTANTS = require('./../constants');
const {
  PAGINATION_OFFERS: { DEFAULT_PAGE, DEFAULT_RESULTS },
} = CONSTANTS;

module.exports.paginateOffers = async (req, res, next) => {
  let { page, results } = req.query;

  page = (await PAGE_VALIDATION_SCHEMA.isValid(page)) ? page : DEFAULT_PAGE;

  results = (await RESULTS_VALIDATION_SCHEMA.isValid(results))
    ? results
    : DEFAULT_RESULTS;

  const limit = results;
  const offset = (page - 1) * results;

  req.pagination = { limit, offset };
  next();
};
