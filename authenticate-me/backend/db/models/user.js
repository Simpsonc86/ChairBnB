'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      
      // define association here
      User.hasMany(models.Spot,{
        foreignKey: 'ownerId',
        onDelete:'CASCADE',
        hooks:true
      });
      User.hasMany(models.Booking,{
        foreignKey: 'userId',
        onDelete:'CASCADE',
        hooks:true
      });
      User.hasMany(models.Reviews,{
        foreignKey: 'userId',
        onDelete:'CASCADE',
        hooks:true
      });
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 30],
          isAlpha:true
          // isCapitalized(value){
          //   if(!value[0].Uppercase()){
          //     throw new Error("First name must be capitalized.");
          //   }
          // }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 30],
          isAlpha:true
          // isCapitalized(value){
          //   if(!value[0].Uppercase()){
          //     throw new Error("Last name must be capitalized.");
          //   }
          // }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};