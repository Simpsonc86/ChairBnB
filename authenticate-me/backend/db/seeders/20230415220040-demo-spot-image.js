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
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116232542048243732/Sherrill-Furniture_Header_Wing-Chair.png',
        preview:true,

      },
      {
        spotId: 1,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116232541372956712/Extreme-Highback-Contemporary-Lounge-Chair.png',
        preview:false,

      },
      {
        spotId: 1,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116232542425722950/Open_Air_Modern_Pair_of_Hans_Wegner_Bear_Chairs-5.png',
        preview:false,

      },
      {
        spotId: 1,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116232540441825300/modern-swivel-chair-low-profile-living-room-furniture-for-sale-online-designer-seating-ideas-white-boucle-fabric-upholstery-trend-bedroom-library-reading-nook-lounge.png',
        preview:false,

      },
      {
        spotId: 1,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116232541016436776/cue-chair-with-black-legs.png',
        preview:false,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477211290550332/1-types-of-chairs-hero.png',
        preview:true,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477211840008325/26072.png',
        preview:false,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212175544371/transitional-living-room.png',
        preview:false,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212569813112/image-asset.png',
        preview:false,

      },
      {
        spotId: 2,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1115477212930527232/IMG_6550.png',
        preview:false,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116235740968390707/victorian-1024x768.png',
        preview:true,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116235738527301734/sofaset12-19-19wh.png',
        preview:false,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116235739793981492/antique-couch-sofa-and-settee-styles-4021117-hero-519e7af4b57742a5b81bdf61b2aeeb67.png',
        preview:false,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116235740125343744/details-of-vintage-furniture-royalty-free-image-1586449199.png',
        preview:false,

      },
      {
        spotId: 3,
        url:'https://cdn.discordapp.com/attachments/1085969145276923935/1116235739198394399/antique-regency-mahogany-framed-sofa-with-dodo-head-detail-sku92328286_0.png',
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
