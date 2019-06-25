/* eslint-disable max-lines */
const chai = require('chai'),
  { factory } = require('factory-girl'),
  models = require('../../app/models'),
  server = require('../../app');

/* eslint-disable no-unused-vars */
const should = chai.should(),
  endpoint = '/products',
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

describe('Products Controller', () => {
  describe('/products GET', () => {
    let token = null;

    beforeEach('', () =>
      Promise.all([
        factory.create('users', { active: true, password: PASSWORD }),
        factory.createMany('products', 20)
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

    it('Should be successful with all products', () =>
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
  describe('/products POST', () => {
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
    it('Should fail because product already exists', () =>
      factory.create('products').then(product => {
        const productToCreate = { ...product.dataValues };
        productToCreate.active_principle_id = productToCreate.activePrincipleId;
        return chai
          .request(server)
          .post(endpoint)
          .set('authorization', tokenAdmin)
          .send(productToCreate)
          .then(res => {
            res.status.should.equal(401);
          });
      }));
  });
  describe('/products/:id GET', () => {
    let token = null;
    let idProduct1 = null;
    let idProduct2 = null;

    beforeEach('', () =>
      Promise.all([
        factory.create('users', { active: true, password: PASSWORD }),
        factory.create('products'),
        factory.build('products')
      ]).then(([user, product1, product2]) =>
        login(user.email).then(logUser => {
          token = logUser.header.authorization;
          idProduct1 = product1.id;
          idProduct2 = product2.id;
        })
      )
    );

    it('Should fail because isnt token', () =>
      chai
        .request(server)
        .get(`${endpoint}/${idProduct1}`)
        .then(res => {
          res.status.should.equal(401);
        }));
    it('Should be successful', () =>
      chai
        .request(server)
        .get(`${endpoint}/${idProduct1}`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(200);
        }));
    it('Should fail because product is inexistent', () =>
      chai
        .request(server)
        .get(`${endpoint}/${idProduct2}`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(404);
        }));
  });
  describe('/products/:id DELETE', () => {
    let token = null;
    let tokenAdmin = null;
    let idProduct1 = null;
    let idProduct2 = null;

    beforeEach('', () =>
      Promise.all([
        factory.create('users', { active: true, password: PASSWORD }),
        factory.create('users', { active: true, password: PASSWORD, admin: true }),
        factory.createMany('products', 2),
        factory.build('products')
      ]).then(([user, admin, products, principle]) =>
        Promise.all([login(user.email), login(admin.email)]).then(([logUser, logAdmin]) => {
          token = logUser.header.authorization;
          tokenAdmin = logAdmin.header.authorization;
          idProduct1 = products[0].id;
          idProduct2 = principle.id;
        })
      )
    );

    it('Should fail because isnt token', () =>
      chai
        .request(server)
        .delete(`${endpoint}/${idProduct1}`)
        .then(res => {
          res.status.should.equal(401);
        }));
    it('Should fail because user isnt admin', () =>
      chai
        .request(server)
        .delete(`${endpoint}/${idProduct1}`)
        .set('authorization', token)
        .then(res => {
          res.status.should.equal(409);
        }));
    it('Should fail because product is inexistent', () =>
      chai
        .request(server)
        .delete(`${endpoint}/${idProduct2}`)
        .set('authorization', tokenAdmin)
        .then(res => {
          res.status.should.equal(404);
        }));
    it('Should be successful', () =>
      models.products.findAll().then(products => {
        products.length.should.equal(2);
        return chai
          .request(server)
          .delete(`${endpoint}/${idProduct1}`)
          .set('authorization', tokenAdmin)
          .then(res => {
            res.status.should.equal(200);
            return models.products.findAll().then(actualProducts => {
              actualProducts.length.should.equal(1);
            });
          });
      }));
  });
});
