const { logError } = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logError(err, err.status || 500);

  if (
    err.message ===
      'new row for relation "Banks" violates check constraint "Banks_balance_ck"' ||
    err.message ===
      'new row for relation "Users" violates check constraint "Users_balance_ck"'
  ) {
    err.message = 'Not Enough money';
    err.code = 406;
  }
  if (!err.message || !err.code) {
    res.status(500).send('Server Error');
  } else {
    res.status(err.code).send(err.message);
  }
};
