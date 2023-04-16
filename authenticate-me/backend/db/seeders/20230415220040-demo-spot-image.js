'use strict';

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA; //define your schema in options
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName= 'SpotImages';
    await queryInterface.bulkInsert(options,[
      {
        spotId: 1,
        url:'testurl.com/images/spot-image1.jpg',
        preview:true,

      },
      {
        spotId: 1,
        url:'testurl.com/images/spot-image2.jpg',
        preview:false,

      },
      {
        spotId: 1,
        url:'testurl.com/images/spotspot-image3.jpg',
        preview:false,

      },
      {
        spotId: 2,
        url:'testurl.com/images/spot2/spot-image1.jpg',
        preview:true,

      },
      {
        spotId: 2,
        url:'testurl.com/images/spot2/spot-image2.jpg',
        preview:false,

      },
      {
        spotId: 2,
        url:'testurl.com/images/spot2/spot-image3.jpg',
        preview:false,

      },
      {
        spotId: 3,
        url:'testurl.com/images/spot3/spot-image1.jpg',
        preview:true,

      },
      {
        spotId: 3,
        url:'testurl.com/images/spot3/spot-image2.jpg',
        preview:false,

      },
      {
        spotId: 2,
        url:'testurl.com/images/spot3/spot-image3.jpg',
        preview:false,

      },
    ],{});
    
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
