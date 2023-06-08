'use strict';
const {Model, Validator} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
     static associate(models) {

      // define association here
      Spot.hasMany(models.SpotImage,{
        foreignKey: 'spotId',
        onDelete:'CASCADE',
        hooks:true
      });
      Spot.hasMany(models.Booking,{
        foreignKey: 'spotId',
        onDelete:'CASCADE',
        hooks:true
      });
      Spot.hasMany(models.Review,{
        foreignKey: 'spotId',
        onDelete:'CASCADE',
        hooks:true
      });
      Spot.belongsTo(models.User,{
        foreignKey:"ownerId"
      });
      
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: {
      type:DataTypes.STRING,
      allowNull:false
    },
    city:{
      type:DataTypes.STRING,
      allowNull:false,
 
    },
    state: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        len:[2,2],
        isAlpha:true
      }
    },
    country: {
      type:DataTypes.STRING(30),
      allowNull:false,
      validate:{
        len:[3,60]
      }
    },
    lat: {
      type:DataTypes.DECIMAL(6,2),
      validate:{
        min:-90,
        max:90
      }
    },
    lng: {
      type:DataTypes.DECIMAL(7,4),
      validate:{
        min:-180,
        max:180
      }
    },
    name: {
      type:DataTypes.STRING(60),
      allowNull:false,
    },
    description: DataTypes.TEXT,
    price: {
      type:DataTypes.DECIMAL(6,2),
      allowNull:false,
      validate:{
        min:100,
        max:10000

      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
    validate:{
      bothCoordinates(){
        if((!this.lat)!==(!this.lng)){
          throw new error('Need both latitude and longitude, or leave both blank!');
        }
      }
    },
  });
  return Spot;
};