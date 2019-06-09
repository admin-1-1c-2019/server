const activePrincipleService = require('../services/active_principle'),
  productsService = require('../services/product'),
  serializer = require('../serializers/active_principle'),
  mapper = require('../mapper/query'),
  errors = require('../errors'),
  logger = require('../logger');

const {
  getActivePrinciples,
  findActivePrincipleByName,
  findActivePrincipleById,
  createActivePrinciple,
  deleteActivePrinciple
} = activePrincipleService;

const { deleteProductsByPrinciple } = productsService;

exports.getActivePrinciples = (req, res, next) => {
  logger.info('Getting all principle actives');
  const options = mapper.query(req.query || {});
  return getActivePrinciples(options)
    .then(principles => {
      const result = serializer.getActivePrinciples(principles);
      return res.status(200).send(result);
    })
    .catch(next);
};

exports.createActivePrinciple = (req, res, next) => {
  const { name } = req.body;
  logger.info(`Looking for an existent active principle with name ${name}`);
  return findActivePrincipleByName(name)
    .then(principle => {
      if (principle) {
        throw errors.existentActivePrinciple(name);
      }
      logger.info('Creating new active principle');
      return createActivePrinciple(req.body);
    })
    .then(() => {
      logger.info('New active principle created');
      return res.status(201).send();
    })
    .catch(next);
};

exports.getActivePrinciple = (req, res, next) => {
  const { id } = req.params;
  logger.info(`Looking for an active principle with id ${id}`);
  return findActivePrincipleById(id)
    .then(principle => {
      if (!principle) {
        throw errors.notFound(`Active principle with id ${id} not found`);
      }
      const result = serializer.getActivePrinciple(principle);
      return res.status(200).send(result);
    })
    .catch(next);
};

exports.deleteActivePrinciple = (req, res, next) => {
  const { id } = req.params;
  logger.info(`Looking for an active principle with id ${id}`);
  return findActivePrincipleById(id)
    .then(principle => {
      if (!principle) {
        throw errors.notFound(`Active principle with id ${id} not found`);
      }
      logger.info(`Deleting products with principle id ${id}`);
      return deleteProductsByPrinciple(id);
    })
    .then(() => {
      logger.info(`Deleting active principle with id ${id}`);
      return deleteActivePrinciple(id);
    })
    .then(() => {
      logger.info(`Deleted active principle with id ${id}`);
      return res.status(200).send();
    })
    .catch(next);
};
