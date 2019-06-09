/* eslint-disable new-cap */
const { paramsValidations } = require('../constants/error_catalog'),
  config = require('../../config');

const sizes = config.common.activePrincipleSizes;
const maxImages = 3;

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
  },
  images: {
    in: ['body'],
    errorMessage: paramsValidations.IMAGES,
    isArray: true,
    custom: {
      options: options => options.length > 0 && options.length <= maxImages,
      errorMessage: paramsValidations.IMAGES
    }
  },
  'images.*': {
    isString: true,
    errorMessage: paramsValidations.IMAGE
  },
  size: {
    in: ['body'],
    isInt: true,
    toInt: true,
    errorMessage: paramsValidations.SIZE,
    custom: {
      options: value => sizes.includes(value),
      errorMessage: paramsValidations.SIZE
    }
  },
  active_principle_id: {
    in: ['body'],
    errorMessage: paramsValidations.ID('active_principle_id'),
    isUUID: true
  }
};

exports.id = {
  id: {
    in: ['params'],
    errorMessage: paramsValidations.ID('this id'),
    isUUID: true
  }
};
