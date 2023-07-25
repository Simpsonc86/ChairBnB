'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User,{foreignKey: 'userId'});
      Review.belongsTo(models.Spot,{foreignKey: 'spotId'});
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete:'CASCADE',
        hooks:true
      })
    }
  }
  Review.init({
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    review: {
      type:DataTypes.STRING(256),
      allowNull:false
    },
    stars: {
      type:DataTypes.DECIMAL(3,2),
      allowNull:false,
      validate:{
        min:1,
        max:5
      }
    }

  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};