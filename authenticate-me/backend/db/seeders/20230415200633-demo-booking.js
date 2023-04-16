'use strict';

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA; //define your schema in options
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
   await queryInterface.bulkInsert(options,[
    {
      spotId:1,
      userId:2,
      startDate: new Date('2022-10-31'),
      endDate: new Date('2022-11-02'),

    },
    {
      spotId:2,
      userId:2,
      startDate: new Date('2018-10-31'),
      endDate: new Date('2018-11-02'),

    },
    {
      spotId:3,
      userId:2,
      startDate: new Date('2022-12-31'),
      endDate: new Date('2023-1-02'),

    },
  ],{});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2022-10-31', '2018-10-31', '2022-12-31'] }
    }, {});
  }
};
