const { paramsValidations } = require('../constants/error_catalog');

/* eslint-disable new-cap */
exports.create = {
  name: {
    in: ['body'],
    errorMessage: paramsValidations.NAME,
    isString: true
  },
  description: {
    in: ['body'],
    isString: true,
    errorMessage: paramsValidations.DESCRIPTION
  }
};

exports.id = {
  id: {
    in: ['params'],
    errorMessage: paramsValidations.ID('this id'),
    isUUID: true
  }
};

exports.pagination = {
  page: {
    in: ['query'],
    optional: true,
    isInt: {
      options: {
        gt: 1
      }
    },
    toInt: true,
    errorMessage: paramsValidations.PAGE
  },
  limit: {
    in: ['query'],
    optional: true,
    isInt: {
      options: {
        gt: 0
      }
    },
    toInt: true,
    errorMessage: paramsValidations.LIMIT
  }
};
