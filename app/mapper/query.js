const config = require('./../../config');

const { pagination } = config.common;

exports.query = param => {
  const limit = param.limit || pagination.limit;
  const page = param.page || pagination.page;
  const offset = limit * (page - 1);
  return {
    limit,
    offset
  };
};
