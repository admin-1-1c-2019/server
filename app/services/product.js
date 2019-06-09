const models = require('../models'),
  errors = require('../errors');

const Products = models.products,
  ActivePrinciples = models.activePrinciples;

const include = [{ model: ActivePrinciples, required: true }];

exports.getProducts = options =>
  Products.findAll({ ...options, include }).catch(err => {
    throw errors.databaseError(err.message);
  });

const findProduct = where =>
  Products.findOne({ where, include }).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.findProductByName = name => {
  const where = { name };
  return findProduct(where);
};

exports.findProductById = id => {
  const where = { id };
  return findProduct(where);
};

exports.createProduct = body =>
  Products.create(body).catch(err => {
    throw errors.databaseError(err.message);
  });

const deleteProducts = where =>
  Products.destroy({ where }).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.deleteProduct = id => {
  const where = { id };
  return deleteProducts(where);
};

exports.deleteProductsByPrinciple = id => {
  const where = { activePrincipleId: id };
  return deleteProducts(where);
};
