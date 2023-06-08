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
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212930527232/IMG_6550.png',
        preview:true,

      },
      {
        spotId: 1,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212175544371/transitional-living-room.png',
        preview:false,

      },
      {
        spotId: 1,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212930527232/IMG_6550.png',
        preview:false,

      },
      {
        spotId: 1,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212930527232/IMG_6550.png',
        preview:false,

      },
      {
        spotId: 1,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212930527232/IMG_6550.png',
        preview:false,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212569813112/image-asset.png',
        preview:true,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212175544371/transitional-living-room.png',
        preview:false,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212930527232/IMG_6550.png',
        preview:false,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212930527232/IMG_6550.png',
        preview:false,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212569813112/image-asset.png',
        preview:false,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212175544371/transitional-living-room.png',
        preview:true,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212175544371/transitional-living-room.png',
        preview:false,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212930527232/IMG_6550.png',
        preview:false,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212175544371/transitional-living-room.png',
        preview:false,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212930527232/IMG_6550.png',
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
