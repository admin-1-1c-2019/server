const userService = require('../services/user'),
  emailService = require('../services/email'),
  userMapper = require('../mapper/user'),
  bcrypt = require('bcryptjs'),
  sessionManager = require('../helpers/session_manager'),
  errors = require('../errors'),
  logger = require('../logger');

exports.signUp = (req, res, next) => {
  const { email } = req.body;
  logger.info(`User with email ${email} is attemting to sing up`);
  return userService
    .checkEmail(req.body)
    .then(user => {
      if (user && user.active) {
        logger.info(`User with email ${email} already exists`);
        throw errors.registeredUser();
      }
      if (user) {
        logger.info(`User with email: ${email} didn't confirm the account yet`);
        throw errors.unconfirmedUser();
      }
      return userMapper.signUp(req.body);
    })
    .then(userService.signUp)
    .then(newUser => {
      logger.info(`User registered ${newUser.dataValues}`);
      logger.info('Sending email to confirm account');
      emailService.sendMailConfirmation(newUser.dataValues);
      return res.status(201).send();
    })
    .catch(next);
};

exports.confirmation = (req, res, next) =>
  userService
    .confirmation(req.user.email)
    .then(() => {
      logger.info('User Confirmed');
      return res.status(200).send(`User with email: ${req.user.email} confirmed`);
    })
    .catch(next);

exports.resendEmail = (req, res, next) => {
  const { email } = req.body;
  return userService
    .findByEmail(email)
    .then(user => {
      if (!user) {
        throw errors.unregisteredUser();
      }
      if (user.active) {
        throw errors.activeUser();
      }
      logger.info('Resending email to confirm account');
      return emailService.sendMailConfirmation(user.dataValues);
    })
    .then(() => {
      logger.info(`Email resent to user ${email}`);
      res.status(200).send();
    })
    .catch(next);
};

exports.recoverPassword = (req, res, next) => {
  const { email } = req.body;

  return userService
    .findByEmail(email)
    .then(user => {
      if (!user) {
        throw errors.unregisteredUser();
      }
      logger.info('Sending email to recover password');
      return emailService.sendMailRecoverPassword(user.dataValues);
    })
    .then(() => {
      logger.info(`Recover password email resent to user ${email}`);
      res.status(200).send();
    })
    .catch(next);
};

exports.changePassword = (req, res, next) =>
  userMapper
    .mapPassword(req.body.password)
    .then(password => userService.changePassword(req.user.id, password))
    .then(() => {
      logger.info('User password updated.');
      return res.status(200).send('User password changed.');
    })
    .catch(next);

exports.loginIndividual = (req, res, next) => {
  const { email, password } = req.body;
  logger.info(`User with email ${email} attempting to login`);
  return userService
    .findByEmail(email)
    .then(user => {
      if (!user) {
        return next(errors.authenticationError('Incorrect email or password'));
      }
      if (user && !user.active) {
        return next(errors.unconfirmedUser());
      }
      return bcrypt.compare(password, user.password).then(match => {
        if (!match) {
          return next(errors.authenticationError('Incorrect email or password'));
        }
        const authentication = sessionManager.encode({ email });
        logger.info(`User with email ${email} is now logged`);
        return res
          .status(201)
          .set(sessionManager.HEADER_NAME, authentication)
          .send(user);
      });
    })
    .catch(next);
};
