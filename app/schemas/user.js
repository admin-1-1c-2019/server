const { paramsValidations } = require('../constants/error_catalog');

exports.signUp = {
  email: {
    in: ['body'],
    errorMessage: paramsValidations.EMAIL,
    isEmail: true
  },
  password: {
    in: ['body'],
    isString: true,
    isLength: {
      options: {
        min: 8,
        max: 25
      }
    },
    errorMessage: paramsValidations.PASSWORD
  },
  first_name: {
    in: ['body'],
    isString: true,
    errorMessage: paramsValidations.FIRST_NAME
  },
  last_name: {
    in: ['body'],
    isString: true,
    errorMessage: paramsValidations.LAST_NAME
  }
};

exports.resendEmail = {
  email: {
    in: ['body'],
    errorMessage: paramsValidations.EMAIL,
    isEmail: true
  }
};

exports.changePassword = {
  password: {
    in: ['body'],
    isString: true,
    isLength: {
      options: {
        min: 8,
        max: 25
      }
    },
    errorMessage: paramsValidations.PASSWORD
  }
};

exports.recoverPassword = {
  email: {
    in: ['body'],
    errorMessage: paramsValidations.EMAIL,
    isEmail: true
  }
};

exports.logIn = {
  email: {
    in: ['body'],
    errorMessage: paramsValidations.EMAIL,
    isEmail: true
  },
  password: {
    in: ['body'],
    errorMessage: paramsValidations.PASSWORD,
    isString: true
  }
};
