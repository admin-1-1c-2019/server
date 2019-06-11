const models = require('./../../app/models'),
  { factory } = require('factory-girl'),
  bcrypt = require('bcryptjs');

const Users = models.users,
  ActivePrinciples = models.activePrinciples;

factory.define(
  'users',
  Users,
  {
    email: factory.chance('email', { domain: 'fi.uba.ar' }),
    password: factory.chance('string', { length: 10 }),
    firstName: factory.chance('first'),
    lastName: factory.chance('last'),
    active: false,
    admin: false
  },
  {
    afterBuild: model =>
      bcrypt.hash(model.password, 10).then(hash => {
        model.password = hash;
        return model;
      })
  }
);

factory.define('principles', ActivePrinciples, {
  name: factory.chance('string'),
  description: factory.chance('string')
});
