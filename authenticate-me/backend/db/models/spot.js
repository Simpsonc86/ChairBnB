'use strict';
const {Model, Validator} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.SpotImage,{
        foreignKey: 'spotId',
        onDelete:'CASCADE',
        hooks:true
      });
      User.hasMany(models.Booking,{
        foreignKey: 'spotId',
        onDelete:'CASCADE',
        hooks:true
      });
      User.hasMany(models.Reviews,{
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
      validate:{
        isAlpha:true
      }
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
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isAlpha:true
      }
    },
    lat: {
      type:DataTypes.INTEGER,
      validate:{
        min:-90,
        max:90
      }
    },
    lng: {
      type:DataTypes.INTEGER,
      validate:{
        min:-180,
        max:180
      }
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL
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