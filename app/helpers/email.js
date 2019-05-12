const handlebars = require('handlebars'),
  sessionManager = require('./session_manager'),
  fs = require('fs'),
  config = require('../../config');

const { url } = config.common.api,
  { expireTime } = config.common.email;

const getEndpoint = (user, endpoint) =>
  `${url}${endpoint}?authorization=${sessionManager.encode(user, expireTime)}`;

exports.htmlFormat = (user, path, endpoint) =>
  new Promise((resolve, reject) => {
    const template = `${process.cwd()}${path}`;
    fs.readFile(template, 'utf8', (err, file) => {
      if (err) {
        return reject(err);
      }
      const compiledTmpl = handlebars.compile(file);
      const context = {
        url: getEndpoint(user, endpoint),
        firstName: user.firstName,
        lastName: user.lastName
      };
      const htmlFinal = compiledTmpl(context);
      return resolve(htmlFinal);
    });
  });
