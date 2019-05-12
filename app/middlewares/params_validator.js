const { checkSchema, validationResult } = require('express-validator/check'),
  errors = require('./../errors');

const checkValidationResult = (request, response, next) => {
  const errorsResult = validationResult(request);
  if (!errorsResult.isEmpty()) {
    return next(errors.schemaError(errorsResult.array({ onlyFirstError: true }).map(e => e.msg)));
  }
  return next();
};

exports.validateSchema = schema => checkSchema(schema);

exports.validateSchemaAndFail = schema => [exports.validateSchema(schema), checkValidationResult];
