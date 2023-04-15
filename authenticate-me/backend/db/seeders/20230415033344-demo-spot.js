'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        onwerId:1,
        address: "911 Fireman Rd",
        city:"Fireville",
        state:"NY",
        country:"USA",
        lat:40.7128,
        lng:-74.0060,
        name:"Hot spot",
        description:"Hottest place in the city. Nightlife sizzle!",
        price: 300,
      },
      {
        onwerId:2,
        address: "1569 Desert Cove Cir",
        city:"Tumbleweed",
        state:"CA",
        country:"USA",
        lat:38.8375,
        lng:-120.8958,
        name:"Relaxation Haven",
        description:"Solitude confirmed. Can hear the coyotes howl!",
        price: 89.99,
      },
      {
        onwerId:3,
        address: "2288 Wilter Mountain Rd",
        city:"Hilly Hilly",
        state:"NA",
        country:"India",
        lat:28.5983,
        lng:83.9310,
        name:"Hot spot",
        description:"Hottest place in the city. Nightlife sizzle!",
        price: 300,
      },
    ]
      
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
