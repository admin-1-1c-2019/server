const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.REGISTERED_USER = 'registered_user';
exports.registeredUser = () => internalError('User already registered', exports.REGISTERED_USER);

exports.ACTIVE_USER = 'active_user';
exports.activeUser = email => internalError(`User with ${email} is already active`, exports.ACTIVE_USER);

exports.MAIL_ERROR = 'mail_error';
exports.emailError = message => internalError(message, exports.MAIL_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.AUTHENTICATION_ERROR = 'authentication_error';
exports.authenticationError = message => internalError(message, exports.AUTHENTICATION_ERROR);

exports.NOT_FOUND = 'not_found';
exports.notFound = message => internalError(message, exports.NOT_FOUND);

exports.SCHEMA_ERROR = 'schema_error';
exports.schemaError = message => internalError(message, exports.SCHEMA_ERROR);

exports.UNREGISTERED_USER = 'unregistered user';
exports.unregisteredUser = email =>
  internalError(`No user registered with this email: ${email}`, exports.UNREGISTERED_USER);

exports.EXPIRED_TOKEN = 'expired_token';
exports.expiredToken = () => internalError('The token is expired', exports.EXPIRED_TOKEN);

exports.INEXISTENT_TOKEN = 'inexistent_token';
exports.inexistentToken = () => internalError('Inexistent Token', exports.INEXISTENT_TOKEN);

exports.UNCONFIRMED_USER = 'unconfirmed_user';
exports.unconfirmedUser = () =>
  internalError("The user hasn't confirmed the account yet", exports.UNCONFIRMED_USER);

exports.NOT_ADMIN = 'user_not_admin';
exports.userNotAdmin = email => internalError(`User with ${email} isn't admin`, exports.NOT_ADMIN);

exports.EXISTENT_ACTIVE_PRINCIPLE = 'existent_principle_active';
exports.existentActivePrinciple = name =>
  internalError(`Active principle with name ${name} already exists`, exports.EXISTENT_ACTIVE_PRINCIPLE);

exports.EXISTENT_PRODUCT = 'existent_product';
exports.existentProduct = errors => internalError(JSON.stringify(errors), exports.EXISTENT_PRODUCT);
