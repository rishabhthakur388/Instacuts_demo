'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class days extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      days.hasMany(models.schedule,{
        foreignKey:"id"

      })
    }
  }
  days.init({
    barber_id: DataTypes.INTEGER,
    monday: DataTypes.INTEGER,
    tuesday: DataTypes.INTEGER,
    wednesday: DataTypes.INTEGER,
    thursday: DataTypes.INTEGER,
    friday: DataTypes.INTEGER,
    saturday: DataTypes.INTEGER,
    sunday: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'days',
  });
  return days;
};