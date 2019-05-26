/* eslint-disable max-lines */
const chai = require('chai'),
  { factory } = require('factory-girl'),
  sinon = require('sinon'),
  // bcrypt = require('bcryptjs'),
  models = require('../../app/models'),
  server = require('../../app'),
  emailService = require('../../app/services/email'),
  dataMocks = require('../support/data_mocks'),
  { encode } = require('../../app/helpers/session_manager');
// { mapPassword } = require('../../app/mapper/user');

/* eslint-disable no-unused-vars */
const should = chai.should(),
  endpoint = '/users',
  endpointResend = '/users/resend_email',
  endpointRecover = '/users/recover_password',
  endpointLogin = '/users/login',
  timeToExpire = '1s';
/* eslint-enable no-unused-vars */

const delay = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

describe('User Controller', () => {
  sinon.stub(emailService, 'sendMailConfirmation').resolves({});
  sinon.stub(emailService, 'sendMailRecoverPassword').resolves({});
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
  describe('/users/resend_email POST', () => {
    let user = null;
    const body = {};
    beforeEach('', () =>
      factory.create('users').then(userCreated => {
        user = userCreated.dataValues;
        body.email = user.email;
      })
    );
    it('Should be successful', () =>
      chai
        .request(server)
        .post(endpointResend)
        .send(body)
        .then(res => {
          res.status.should.equal(200);
        }));
    it('Should fail because inexistent user', () => {
      body.email = 'test@test.com';
      return chai
        .request(server)
        .post(endpointResend)
        .send(body)
        .then(res => {
          res.status.should.equal(401);
        });
    });
    it('Should fail because user is active', () =>
      models.users.update({ active: true }, { where: { email: user.email } }).then(() =>
        chai
          .request(server)
          .post(endpointResend)
          .send(body)
          .then(res => {
            res.status.should.equal(401);
          })
      ));
    it('Should fail because invalid body', () => {
      const bodyTest = { keyTest: 'valueTest' };
      return chai
        .request(server)
        .post(endpointResend)
        .send(bodyTest)
        .then(res => {
          res.status.should.equal(422);
        });
    });
    it('Should fail because empty body', () => {
      const bodyTest = {};
      return chai
        .request(server)
        .post(endpointResend)
        .send(bodyTest)
        .then(res => {
          res.status.should.equal(422);
        });
    });
  });
  describe('/users/recover_password POST', () => {
    let user = null;
    const body = {};
    beforeEach('', () =>
      factory.create('users').then(userCreated => {
        user = userCreated.dataValues;
        body.email = user.email;
      })
    );
    it('Should be successful', () =>
      chai
        .request(server)
        .post(endpointRecover)
        .send(body)
        .then(res => {
          res.status.should.equal(200);
        }));
    it('Should fail because inexistent user', () => {
      body.email = 'test@test.com';
      return chai
        .request(server)
        .post(endpointRecover)
        .send(body)
        .then(res => {
          res.status.should.equal(401);
        });
    });
    it('Should fail because invalid body', () => {
      const bodyTest = { keyTest: 'valueTest' };
      return chai
        .request(server)
        .post(endpointRecover)
        .send(bodyTest)
        .then(res => {
          res.status.should.equal(422);
        });
    });
    it('Should fail because empty body', () => {
      const bodyTest = {};
      return chai
        .request(server)
        .post(endpointRecover)
        .send(bodyTest)
        .then(res => {
          res.status.should.equal(422);
        });
    });
  });
  describe('/users/recover_password PUT', () => {
    let token = null;
    let user = null;
    const body = { password: 'New Password' };
    beforeEach('', () =>
      factory.create('users').then(userCreated => {
        user = userCreated.dataValues;
        token = encode(user, timeToExpire);
      })
    );

    it('Should be successful', () =>
      chai
        .request(server)
        .put(endpointRecover)
        .set('authorization', token)
        .send(body)
        .then(res => {
          res.status.should.equal(201);
          // return Promise.all([
          //   models.users.findOne({ where: { email: user.email } }),
          //   mapPassword(body.password)
          // ]).then(([foundUser, hashedPassword]) =>
          //   bcrypt.compare(foundUser.dataValues.password, hashedPassword).then(match => {
          //     match.should.equal(true);
          //   })
          // );
        }));
    it('Should fail because inexistent token', () =>
      chai
        .request(server)
        .put(endpointRecover)
        .then(res => {
          res.status.should.equal(401);
        }));
    it('Should fail because token is expired', () =>
      delay(1000).then(() =>
        chai
          .request(server)
          .put(endpointRecover)
          .set('authorization', token)
          .then(res => {
            res.status.should.equal(401);
          })
      ));
    it('Should fail because inexistent user', () => {
      const tokenTest = encode({ email: 'test@test.com' }, timeToExpire);
      return chai
        .request(server)
        .put(endpointRecover)
        .set('authorization', tokenTest)
        .send(body)
        .then(res => {
          res.status.should.equal(401);
        });
    });
    it('Should fail because invalid body', () => {
      const bodyTest = { keyTest: 'valueTest' };
      return chai
        .request(server)
        .put(endpointRecover)
        .set('authorization', token)
        .send(bodyTest)
        .then(res => {
          res.status.should.equal(422);
        });
    });
    it('Should fail because empty body', () => {
      const bodyTest = {};
      return chai
        .request(server)
        .put(endpointRecover)
        .set('authorization', token)
        .send(bodyTest)
        .then(res => {
          res.status.should.equal(422);
        });
    });
  });
  describe('/users/login POST', () => {
    const password = '12345678';
    const body = { password };
    it('Should be successful', () =>
      factory.create('users', { password, active: true }).then(userCreated => {
        body.email = userCreated.dataValues.email;
        return chai
          .request(server)
          .post(endpointLogin)
          .send(body)
          .then(res => {
            res.status.should.equal(201);
          });
      }));
    it('Should fail because user is inactive', () =>
      factory.create('users', { password }).then(userCreated => {
        body.email = userCreated.dataValues.email;
        return chai
          .request(server)
          .post(endpointLogin)
          .send(body)
          .then(res => {
            res.status.should.equal(409);
          });
      }));
    it("Should fail because user doesn't exists", () =>
      factory.create('users', { password, active: true }).then(() => {
        body.email = 'test@test.com';
        return chai
          .request(server)
          .post(endpointLogin)
          .send(body)
          .then(res => {
            res.status.should.equal(401);
          });
      }));
    it('Should fail because password is invalid', () =>
      factory.create('users', { password, active: true }).then(userCreated => {
        body.email = userCreated.dataValues.email;
        body.password = 'wrong password';
        return chai
          .request(server)
          .post(endpointLogin)
          .send(body)
          .then(res => {
            res.status.should.equal(401);
          });
      }));
  });
});
