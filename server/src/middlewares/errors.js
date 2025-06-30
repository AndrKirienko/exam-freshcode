const { logError } = require('../utils/logger');

const errors = (err, req, res, next) => {
  logError(err, err.status || 500);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
};

module.exports = errors;
