const bcrypt = require('bcryptjs');

const hashPassword = password => bcrypt.hash(password, 10);

exports.mapPassword = password => hashPassword(password);

exports.signUp = body =>
  hashPassword(body.password).then(password => ({
    email: body.email,
    firstName: body.first_name,
    lastName: body.last_name,
    password
  }));
