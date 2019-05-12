const { healthCheck } = require('./controllers/healthCheck'),
  userController = require('./controllers/user'),
  paramsValidator = require('./middlewares/params_validator'),
  schemas = require('./schemas');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [paramsValidator.validateSchemaAndFail(schemas.user.signUp)], userController.signUp);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
