'use strict';

module.exports = (sequelize, DataTypes) => {
  const ActivePrinciples = sequelize.define(
    'activePrinciples',
    {
      id: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false }
    },

    {
      underscored: true,
      tableName: 'active_principles'
    }
  );

  ActivePrinciples.associate = models => {
    ActivePrinciples.hasMany(models.products, { foreignKey: 'id' });
  };

  return ActivePrinciples;
};
