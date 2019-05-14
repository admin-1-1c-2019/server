const { healthCheck } = require('./controllers/healthCheck'),
  userController = require('./controllers/user'),
  paramsValidator = require('./middlewares/params_validator'),
  authMiddleware = require('./middlewares/auth'),
  schemas = require('./schemas');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [paramsValidator.validateSchemaAndFail(schemas.user.signUp)], userController.signUp);
  app.put('/users', [], userController.confirmation);
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
    `/users/login`,
    [paramsValidator.validateSchemaAndFail(schemas.user.logIn)],
    userController.loginIndividual
  );
};
