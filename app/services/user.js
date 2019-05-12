const models = require('../models'),
  logger = require('../logger'),
  errors = require('../errors');

const Users = models.users;

exports.checkEmail = ({ email }) =>
  Users.findOne({ where: { email } }).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.signUp = user => {
  logger.info(`Creating user with this values ${JSON.stringify(user)}`);
  return Users.create(user).catch(err => {
    throw errors.databaseError(err.message);
  });
};

const update = (body, where) =>
  Users.update(body, { where }).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.confirmation = email => {
  const where = { email };
  const body = { active: true };
  logger.info(`Enabling account for email ${email}`);
  return update(body, where);
};

exports.changePassword = (id, password) => {
  const where = { id };
  const body = { password };
  logger.info(`Updating password for user ${id}`);
  return update(body, where);
};
