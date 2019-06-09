const { healthCheck } = require('./controllers/healthCheck'),
  userController = require('./controllers/user'),
  activePrinciplesController = require('./controllers/active_principle'),
  productsController = require('./controllers/product'),
  paramsValidator = require('./middlewares/params_validator'),
  authMiddleware = require('./middlewares/auth'),
  schemas = require('./schemas');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [paramsValidator.validateSchemaAndFail(schemas.user.signUp)], userController.signUp);
  app.put('/users', [authMiddleware.authenticate], userController.confirmation);
  app.post(
    '/users/resend_email',
    [paramsValidator.validateSchemaAndFail(schemas.user.resendEmail)],
    userController.resendEmail
  );
  app.post(
    '/users/recover_password',
    [paramsValidator.validateSchemaAndFail(schemas.user.recoverPassword)],
    userController.recoverPassword
  );
  app.put(
    '/users/recover_password',
    [authMiddleware.authenticate, paramsValidator.validateSchemaAndFail(schemas.user.changePassword)],
    userController.changePassword
  );

  app.post(
    '/users/login',
    [paramsValidator.validateSchemaAndFail(schemas.user.logIn)],
    userController.loginIndividual
  );

  app.put(
    '/users/admin',
    [authMiddleware.authenticateAdmin, paramsValidator.validateSchemaAndFail(schemas.user.upgradeAdmin)],
    userController.upgradeAdmin
  );

  app.get(
    '/active_principles',
    [authMiddleware.authenticate, paramsValidator.validateSchemaAndFail(schemas.activePrinciple.pagination)],
    activePrinciplesController.getActivePrinciples
  );
  app.post(
    '/active_principles',
    [authMiddleware.authenticateAdmin, paramsValidator.validateSchemaAndFail(schemas.activePrinciple.create)],
    activePrinciplesController.createActivePrinciple
  );
  app.get(
    '/active_principles/:id',
    [authMiddleware.authenticate, paramsValidator.validateSchemaAndFail(schemas.activePrinciple.id)],
    activePrinciplesController.getActivePrinciple
  );
  app.delete(
    '/active_principles/:id',
    [authMiddleware.authenticateAdmin, paramsValidator.validateSchemaAndFail(schemas.activePrinciple.id)],
    activePrinciplesController.deleteActivePrinciple
  );

  app.get(
    '/products',
    [authMiddleware.authenticate, paramsValidator.validateSchemaAndFail(schemas.activePrinciple.pagination)],
    productsController.getProducts
  );
  app.post(
    '/products',
    [authMiddleware.authenticateAdmin, paramsValidator.validateSchemaAndFail(schemas.product.create)],
    productsController.createProduct
  );
  app.get(
    '/products/:id',
    [authMiddleware.authenticate, paramsValidator.validateSchemaAndFail(schemas.product.id)],
    productsController.getProduct
  );
  app.delete(
    '/products/:id',
    [authMiddleware.authenticateAdmin, paramsValidator.validateSchemaAndFail(schemas.product.id)],
    productsController.deleteProduct
  );
};
