const productsService = require('../services/product'),
  activePrincipleService = require('../services/active_principle'),
  serializer = require('../serializers/product'),
  queryMapper = require('../mapper/query'),
  productMapper = require('../mapper/product'),
  errors = require('../errors'),
  logger = require('../logger');

const { getProducts, findProductByName, findProductById, createProduct, deleteProduct } = productsService;
const { findActivePrincipleById } = activePrincipleService;

exports.getProducts = (req, res, next) => {
  logger.info('Getting all products');
  const options = queryMapper.query(req.query || {});
  return getProducts(options)
    .then(products => {
      const result = serializer.getProducts(products);
      return res.status(200).send(result);
    })
    .catch(next);
};

exports.createProduct = (req, res, next) => {
  const bodyMapped = productMapper.create(req.body);
  const { name, size, activePrincipleId } = bodyMapped;
  const error = [];
  logger.info(`Looking for an existent product with name ${name}`);
  return Promise.all([findActivePrincipleById(activePrincipleId), findProductByName(name)])
    .then(([principle, product]) => {
      if (!principle) {
        throw errors.notFound(`Active principle with id ${activePrincipleId} not found`);
      }
      if (product) {
        if (product.size === size) {
          error.push(`${name} already exists with this size`);
        }
        if (product.activePrincipleId !== activePrincipleId) {
          error.push(`${name} already exists with another active principle`);
        }
        if (error.length) {
          throw errors.existentProduct(error);
        }
      }
      logger.info('Creating new active principle');
      return createProduct(bodyMapped);
    })
    .then(() => {
      logger.info('New product created');
      return res.status(201).send();
    })
    .catch(next);
};

exports.getProduct = (req, res, next) => {
  const { id } = req.params;
  logger.info(`Looking for a product with id ${id}`);
  return findProductById(id)
    .then(product => {
      if (!product) {
        throw errors.notFound(`Product with id ${id} not found`);
      }
      const result = serializer.getProduct(product);
      return res.status(200).send(result);
    })
    .catch(next);
};

exports.deleteProduct = (req, res, next) => {
  const { id } = req.params;
  logger.info(`Looking for a product with id ${id}`);
  return findProductById(id)
    .then(product => {
      if (!product) {
        throw errors.notFound(`Product with id ${id} not found`);
      }
      logger.info(`Deleting product with id ${id}`);
      return deleteProduct(id);
    })
    .then(() => {
      logger.info(`Deleted product with id ${id}`);
      return res.status(200).send();
    })
    .catch(next);
};
