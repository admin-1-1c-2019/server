const nodemailer = require('nodemailer'),
  { htmlFormat } = require('../helpers/email'),
  emailMapper = require('../mapper/email'),
  logger = require('../logger'),
  errors = require('../errors'),
  config = require('../../config');

const confirmationEndpoint = config.common.email.confirmation;
const recoverPassEndpoint = config.common.email.recoverPass;

const confirmationPath = '/views/confirmation.html';
const recoverPassPath = '/views/recoverPass.html';

// create reusable transporter object using the default SMTP transport
// WIll be changed when we get the SES CREDENDIALS
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: config.common.email.username,
    pass: config.common.email.password
  }
});

const sendMail = (user, path, endpoint) =>
  htmlFormat(user, path, endpoint).then(htmlFormated => {
    const mailOptions = emailMapper.options(user, htmlFormated);
    return new Promise((resolve, reject) =>
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(error);
          return reject(errors.emailError(error));
        }
        logger.info(`Message sent: ${info.response}`);
        return resolve();
      })
    );
  });

exports.sendMailConfirmation = user => sendMail(user, confirmationPath, confirmationEndpoint);
exports.sendMailRecoverPassword = user => sendMail(user, recoverPassPath, recoverPassEndpoint);
