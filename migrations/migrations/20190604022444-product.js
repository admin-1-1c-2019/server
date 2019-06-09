'use strict';
/* eslint-disable new-cap */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      active_principle_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'active_principles',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),

  down: queryInterface => queryInterface.dropTable('products')
};
