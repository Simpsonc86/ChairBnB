'use strict';

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA; //define your schema in options
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    await queryInterface.bulkInsert(options,
      [
        {
          userId:2,
          spotId:1,
          review:'Holy toledo! I\'m so glad I came here!',
          stars:5,
        },
        {
          userId:2,
          spotId:2,
          review:'I seen a ghost in the atrium!',
          stars:1,
        },
        {
          userId:2,
          spotId:3,
          review:'I got married! The price was ridiculous however',
          stars:4,
        },
      ]
    )

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] },
    },{});
  }
};
