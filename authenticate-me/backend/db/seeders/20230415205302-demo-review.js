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
          userId:4,
          spotId:1,
          review:'Nice spot, but I\'ve seen better.',
          stars:4,
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
          review:'I got married! The price was too ridiculous however',
          stars:2,
        },
        {
          userId:3,
          spotId:3,
          review:'I would highly recommend this place if you are not afraid of heights.',
          stars:5,
        },
        {
          userId:4,
          spotId:3,
          review:'The place was beautiful, but it was hard to breate!',
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
