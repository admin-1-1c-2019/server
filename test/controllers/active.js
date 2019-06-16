/* eslint-disable max-lines */
const chai = require('chai'),
  { factory } = require('factory-girl'),
  models = require('../../app/models'),
  server = require('../../app');
// dataMocks = require('../support/data_mocks'),

/* eslint-disable no-unused-vars */
const should = chai.should(),
  endpoint = '/active_principles',
  endpointLogin = '/users/login',
  PASSWORD = '12345678';
/* eslint-enable no-unused-vars */

const login = (email, password = PASSWORD) => {
  const body = { email, password };
  return chai
    .request(server)
    .post(endpointLogin)
    .send(body);
};

describe('Active Principle Controller', () => {
  describe('/active_principle GET', () => {
    let token = null;

    beforeEach('', () =>
      Promise.all([
        factory.create('users', { active: true, password: PASSWORD }),
        factory.createMany('principles', 20)
      ]).then(([user]) =>
        login(user.email).then(log => {
          token = log.header.authorization;
        })
      )
    );

    it('Should fail because inexistent token', () =>
      chai
        .request(server)
        .get(endpoint)
        .then(res => {
          res.status.should.equal(401);
        }));

    it('Should be successful with all principles', () =>
      chai
        .request(server)
        .get(endpoint)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(200);
          res.body.length.should.equal(20);
        }));
    it('Should be successful with page 1 and limit 10', () =>
      chai
        .request(server)
        .get(`${endpoint}?limit=10`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(200);
          res.body.length.should.equal(10);
        }));
    it('Should be successful with page 2 and limit 10', () =>
      chai
        .request(server)
        .get(`${endpoint}?limit=10&page=2`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(200);
          res.body.length.should.equal(10);
        }));
    it('Should be successful with 0 principles', () =>
      chai
        .request(server)
        .get(`${endpoint}?page=2`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(200);
          res.body.length.should.equal(0);
        }));
    it('Should be successful with page 3 and limit 9', () =>
      chai
        .request(server)
        .get(`${endpoint}?limit=9&page=3`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(200);
          res.body.length.should.equal(2);
        }));
  });

  describe('/active_principle POST', () => {
    let token = null;
    let tokenAdmin = null;

    beforeEach('', () =>
      Promise.all([
        factory.create('users', { active: true, password: PASSWORD }),
        factory.create('users', { active: true, password: PASSWORD, admin: true })
      ]).then(([user, admin]) =>
        Promise.all([login(user.email), login(admin.email)]).then(([logUser, logAdmin]) => {
          token = logUser.header.authorization;
          tokenAdmin = logAdmin.header.authorization;
        })
      )
    );
    it('Should fail because isnt token', () =>
      chai
        .request(server)
        .post(endpoint)
        .then(res => {
          res.status.should.equal(401);
        }));
    it('Should fail because user isnt admin', () =>
      chai
        .request(server)
        .post(endpoint)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(409);
        }));
    it('Should fail because isnt body', () =>
      chai
        .request(server)
        .post(endpoint)
        .set('authorization', tokenAdmin)
        .send({})
        .then(res => {
          res.status.should.equal(422);
        }));
    it('Should fail because body is incomplete', () =>
      chai
        .request(server)
        .post(endpoint)
        .set('authorization', tokenAdmin)
        .send({ name: 'name' })
        .then(res => {
          res.status.should.equal(422);
        }));
    it('Should fail because principle already exists', () =>
      factory.create('principles').then(principle =>
        chai
          .request(server)
          .post(endpoint)
          .set('authorization', tokenAdmin)
          .send(principle.dataValues)
          .then(res => {
            res.status.should.equal(401);
          })
      ));
  });

  describe('/active_principle/:id GET', () => {
    let token = null;
    let idPrinciple1 = null;
    let idPrinciple2 = null;

    beforeEach('', () =>
      Promise.all([
        factory.create('users', { active: true, password: PASSWORD }),
        factory.create('principles'),
        factory.build('principles')
      ]).then(([user, principle1, principle2]) =>
        login(user.email).then(logUser => {
          token = logUser.header.authorization;
          idPrinciple1 = principle1.id;
          idPrinciple2 = principle2.id;
        })
      )
    );

    it('Should fail because isnt token', () =>
      chai
        .request(server)
        .get(`${endpoint}/${idPrinciple1}`)
        .then(res => {
          res.status.should.equal(401);
        }));
    it('Should be successful', () =>
      chai
        .request(server)
        .get(`${endpoint}/${idPrinciple1}`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(200);
        }));
    it('Should fail because principle is inexistent', () =>
      chai
        .request(server)
        .get(`${endpoint}/${idPrinciple2}`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(404);
        }));
  });

  describe('/active_principle/:id DELETE', () => {
    let token = null;
    let tokenAdmin = null;
    let idPrinciple1 = null;
    let idPrinciple2 = null;

    beforeEach('', () =>
      Promise.all([
        factory.create('users', { active: true, password: PASSWORD }),
        factory.create('users', { active: true, password: PASSWORD, admin: true }),
        factory.createMany('principles', 2),
        factory.build('principles')
      ]).then(([user, admin, principles, principle]) =>
        Promise.all([login(user.email), login(admin.email)]).then(([logUser, logAdmin]) => {
          token = logUser.header.authorization;
          tokenAdmin = logAdmin.header.authorization;
          idPrinciple1 = principles[0].id;
          idPrinciple2 = principle.id;
        })
      )
    );

    it('Should fail because isnt token', () =>
      chai
        .request(server)
        .delete(`${endpoint}/${idPrinciple1}`)
        .then(res => {
          res.status.should.equal(401);
        }));
    it('Should fail because user isnt admin', () =>
      chai
        .request(server)
        .delete(`${endpoint}/${idPrinciple1}`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(409);
        }));
    it('Should fail because principle is inexistent', () =>
      chai
        .request(server)
        .delete(`${endpoint}/${idPrinciple2}`)
        .set('authorization', tokenAdmin)
        .then(res => {
          res.status.should.equal(404);
        }));
    it('Should be successful', () =>
      models.activePrinciples.findAll().then(principles => {
        principles.length.should.equal(2);
        return chai
          .request(server)
          .delete(`${endpoint}/${idPrinciple1}`)
          .set('authorization', tokenAdmin)
          .then(res => {
            res.status.should.equal(200);
            return models.activePrinciples.findAll().then(actualPrinciples => {
              actualPrinciples.length.should.equal(1);
            });
          });
      }));
  });
});
