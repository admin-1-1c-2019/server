const config = require('../../config');

const { from } = config.common.email;

exports.options = (user, html) => ({
  from,
  to: user.email,
  subject: 'Hello ✔',
  html
});
