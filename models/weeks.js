'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weeks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      weeks.hasMany(models.schedule,{
        foreignKey:"id"

      })
    }
  }
  weeks.init({
    barber_id: DataTypes.INTEGER,
    week_one: DataTypes.INTEGER,
    week_two: DataTypes.INTEGER,
    week_three: DataTypes.INTEGER,
    week_four: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'weeks',
  });
  return weeks;
};