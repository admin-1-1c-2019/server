const jwt = require('jsonwebtoken'),
  config = require('./../../config');

const SECRET = config.common.session.secret;
const EXPIRY_TIME = config.common.session.expiryTime;

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = (payload, expiresIn = EXPIRY_TIME) => jwt.sign(payload, SECRET, { expiresIn });

exports.decode = toDecode => jwt.verify(toDecode, SECRET);
