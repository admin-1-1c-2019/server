const errors = require('../errors'),
  config = require('./../../config'),
  userService = require('../services/user'),
  sessionManager = require('../helpers/session_manager'),
  logger = require('../logger');

const HEADER_NAME = config.common.session.header_name;

const authenticate = (admin, req, res, next) => {
  const token = req.headers[HEADER_NAME];
  if (!token) {
    return next(errors.inexistentToken());
  }
  try {
    const { email } = sessionManager.decode(token);
    return userService.findByEmail(email).then(user => {
      if (!user) {
        return next(errors.unregisteredUser());
      }
      if (admin && !user.admin) {
        return next(errors.userNotAdmin(email));
      }
      req.user = user.dataValues;
      logger.info(`User with email ${email} authenticated`);
      return next();
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(errors.authenticationError('Your session has expired'));
    }
    return next(errors.authenticationError('The token is not valid'));
  }
};

exports.authenticate = (req, res, next) => authenticate(false, req, res, next);
exports.authenticateAdmin = (req, res, next) => authenticate(true, req, res, next);
