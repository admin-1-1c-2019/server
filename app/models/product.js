'use strict';
/* eslint-disable new-cap */
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define(
    'products',
    {
      id: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
      size: { type: DataTypes.INTEGER, allowNull: false },
      activePrincipleId: { type: DataTypes.UUID, allowNull: false, field: 'active_principle_id' }
    },

    {
      underscored: true,
      freezeTableName: true
    }
  );

  Products.associate = models => {
    Products.belongsTo(models.activePrinciples, { foreignKey: 'activePrincipleId' });
  };

  return Products;
};
