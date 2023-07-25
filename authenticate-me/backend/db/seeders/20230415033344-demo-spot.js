'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "911 Fireman Rd",
        city: "Fireville",
        state: "NY",
        country: "USA",
        lat: 40.7128,
        lng: -74.0060,
        name: "Hot spot",
        description: "Hottest place in the city. Nightlife sizzle!",
        price: 299.99,
      },
      {
        ownerId: 3,
        address: "1569 Desert Cove Cir",
        city: "Tumbleweed",
        state: "CA",
        country: "USA",
        lat: 38.8375,
        lng: -120.8958,
        name: "Relaxation Haven",
        description: "Solitude confirmed. Can hear the coyotes howl!",
        price: 89.99,
      },
      {
        ownerId: 1,
        address: "2288 Wilter Mountain Rd",
        city: "Hilly Hilly",
        state: "NA",
        country: "India",
        lat: 28.5983,
        lng: 83.9310,
        name: "Enlightenment",
        description: "Highest rental place on earth!",
        price: 9999.99,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] },
    },{});
  }
};
