'use strict';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'users',
    {
      id: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
      lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
      admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },

    {
      underscored: true,
      freezeTableName: true
    }
  );

  // Users.associate = models => {};

  return Users;
};
