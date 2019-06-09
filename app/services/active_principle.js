const models = require('../models'),
  errors = require('../errors');

const ActivePrinciples = models.activePrinciples;

exports.getActivePrinciples = options =>
  ActivePrinciples.findAll(options).catch(err => {
    throw errors.databaseError(err.message);
  });

const findActivePrinciple = where =>
  ActivePrinciples.findOne({ where }).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.findActivePrincipleByName = name => {
  const where = { name };
  return findActivePrinciple(where);
};

exports.findActivePrincipleById = id => {
  const where = { id };
  return findActivePrinciple(where);
};

exports.createActivePrinciple = body =>
  ActivePrinciples.create(body).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.deleteActivePrinciple = id =>
  ActivePrinciples.destroy({ where: { id } }).catch(err => {
    throw errors.databaseError(err.message);
  });
