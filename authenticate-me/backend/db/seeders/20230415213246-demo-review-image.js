'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; //define your schema in options
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'testurl.com/review-pic1.jpg'
      },
      {
        reviewId: 2,
        url: 'testurl.com/review-pic2.jpg'
      },
      {
        reviewId: 3,
        url: 'testurl.com/review-pic3.jpg'
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['testurl.com/review-pic1.jpg', 'testurl.com/review-pic2.jpg', 'testurl.com/review-pic3.jpg'] }
    }, {});
  }
};
