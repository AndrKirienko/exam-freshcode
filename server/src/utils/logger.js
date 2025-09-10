const winston = require('winston');
const path = require('path');

const logFormat = winston.format.printf(
  ({ message, timestamp, code, stack }) => {
    const logObject = {
      time: new Date(timestamp).toISOString(),
      code: code || 500,
      message: message,
      stackTrace: stack || null,
    };

    return JSON.stringify(logObject);
  }
);

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '..', 'logs', 'errors.log'),
    }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

function logError (error, code = 500) {
  logger.error({ message: error.message, code, stack: error.stack });
}

process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  logError(error, 500);
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  console.error('Unhandled Rejection:', reason);
  logError(reason, 500);
});

const wrapAsync = controller => {
  return Object.keys(controller).reduce((wrapped, key) => {
    if (typeof controller[key] === 'function') {
      wrapped[key] = async (req, res, next) => {
        try {
          await controller[key](req, res, next);
        } catch (error) {
          logError(error, error.status || 500);
          next(error);
        }
      };
    } else {
      wrapped[key] = controller[key];
    }
    return wrapped;
  }, {});
};

module.exports = { logError, wrapAsync };
