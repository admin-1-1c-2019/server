const config = require('../../config');

const { from } = config.common.email;

exports.options = (user, html) => ({
  from, // sender address
  to: user.email, // list of receivers
  subject: 'Hello ✔', // Subject line
  html
});
