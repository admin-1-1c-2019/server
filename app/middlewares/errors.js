const errors = require('../errors'),
  logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.MAIL_ERROR]: 400,
  [errors.AUTHENTICATION_ERROR]: 401,
  [errors.UNREGISTERED_USER]: 401,
  [errors.INEXISTENT_TOKEN]: 401,
  [errors.SCHEMA_ERROR]: 422,
  [errors.INEXISTENT_TOKEN]: 401,
  [errors.UNCONFIRMED_USER]: 409,
  [errors.REGISTERED_USER]: 401,
  [errors.ACTIVE_USER]: 401,
  [errors.NOT_ADMIN]: 409,
  [errors.EXISTENT_ACTIVE_PRINCIPLE]: 401,
  [errors.EXISTENT_PRODUCT]: 401,
  [errors.NOT_FOUND]: 404
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) {
    res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  } else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
