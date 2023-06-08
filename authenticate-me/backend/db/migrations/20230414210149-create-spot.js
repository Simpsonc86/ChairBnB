'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users'
        },
        onDelete: 'CASCADE'
      },
      address: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(2), // two letter abbreviations
        allowNull: false,

      },
      country: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      lat: {
        type: Sequelize.DECIMAL(6,4)//from  -90 to 90
      },
      lng: {
        type: Sequelize.DECIMAL(7,4)//from -180 to 180
      },
      name: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(6, 2), //50 min to 9999.99 max
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";
    return queryInterface.dropTable(options);
  }
};