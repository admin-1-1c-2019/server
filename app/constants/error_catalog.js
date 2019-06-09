module.exports = {
  paramsValidations: {
    EMAIL: 'email is mandatory and must be in email',
    PASSWORD: 'password is mandatory and must be a string with a length between 8 and 25 characters',
    FIRST_NAME: 'first_name is mandatory and must be a string',
    LAST_NAME: 'last_name is mandatory and must be a string',
    NAME: 'name is mandatory and must be a string',
    DESCRIPTION: 'description is mandatory and must be a string',
    IMAGES: 'images must be an array with three elements at the most',
    IMAGE: 'each element of images must be a string',
    ID: element => `${element} must be an UUID`,
    SIZE: 'size must be an integer with any of these possible values in ml: 70, 100, 150, 250',
    PAGE: 'page must be an integer greater than 1',
    LIMIT: 'limit must be an integer greater then 0'
  }
};
