/* eslint-disable max-lines */
const chai = require('chai'),
  { factory } = require('factory-girl'),
  // sinon = require('sinon'),
  // models = require('../../app/models'),
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
  describe.only('/active_principle GET', () => {
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
});
