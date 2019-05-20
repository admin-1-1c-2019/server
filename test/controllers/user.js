const chai = require('chai'),
  { factory } = require('factory-girl'),
  models = require('../../app/models'),
  server = require('../../app'),
  dataMocks = require('../support/data_mocks'),
  { encode } = require('../../app/helpers/session_manager');

/* eslint-disable no-unused-vars */
const should = chai.should(),
  endpoint = '/users',
  timeToExpire = '1s';
/* eslint-enable no-unused-vars */

const delay = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

describe('User Controller', () => {
  describe('/users POST', () => {
    it('Should fail because we send empty body', () =>
      chai
        .request(server)
        .post(endpoint)
        .then(res => {
          res.status.should.equal(422);
        }));
    const user = dataMocks.user('admin1@fi.uba.ar', '12345678');
    const userToSend = { ...user };
    it('Should fail because we send incomplete body', () => {
      delete userToSend.password;
      return chai
        .request(server)
        .post(endpoint)
        .send(userToSend)
        .then(res => {
          res.status.should.equal(422);
        });
    });
    it('Should fail because we send a password with less than 8 characters', () => {
      userToSend.password = '1234567';
      return chai
        .request(server)
        .post(endpoint)
        .send(userToSend)
        .then(res => {
          res.status.should.equal(422);
        });
    });
    it('Should fail because we send a password with more than 25 characters', () => {
      userToSend.password = '123456789101112131415161718';
      return chai
        .request(server)
        .post(endpoint)
        .send(userToSend)
        .then(res => {
          res.status.should.equal(422);
        });
    });
    it('Should be successful and the user must be inactive and no admin', () =>
      chai
        .request(server)
        .post(endpoint)
        .send(user)
        .then(res => {
          res.status.should.equal(201);
          return models.users.findOne().then(foundUser => {
            foundUser.email.should.equal(user.email);
            foundUser.active.should.equal(false);
            foundUser.admin.should.equal(false);
          });
        }));
    it('Should fail because user already exists', () =>
      factory.create('users', { email: user.email }).then(() =>
        chai
          .request(server)
          .post(endpoint)
          .send(user)
          .then(res => {
            res.status.should.equal(409);
          })
      ));
  });
  describe('/users PUT', () => {
    let token = null;
    let user = null;
    beforeEach('', () =>
      factory.create('users').then(userCreated => {
        user = userCreated.dataValues;
        token = encode(user, timeToExpire);
      })
    );
    it('Should fail because inexistent token', () =>
      chai
        .request(server)
        .put(endpoint)
        .then(res => {
          res.status.should.equal(401);
        }));
    it('Should fail because token is invalid', () =>
      chai
        .request(server)
        .put(endpoint)
        .set('authorization', 'some token')
        .then(res => {
          res.status.should.equal(401);
        }));
    it('Should fail because token is expired', () =>
      delay(1000).then(() =>
        chai
          .request(server)
          .put(endpoint)
          .set('authorization', token)
          .then(res => {
            res.status.should.equal(401);
          })
      ));
    it('Should be successful and the user must be active', () =>
      chai
        .request(server)
        .put(endpoint)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(201);
          return models.users.findOne().then(foundUser => {
            foundUser.active.should.equal(true);
            foundUser.admin.should.equal(false);
          });
        }));
  });
});
