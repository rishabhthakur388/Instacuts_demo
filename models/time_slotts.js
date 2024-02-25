'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class time_slotts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      time_slotts.hasMany(models.schedule, {
        foreignKey: "id"

      })
      time_slotts.hasMany(models.custom_services, {
        foreignKey: "barber_id",
        // as : "barbarTimeSlots"
      })
    }
  }
  time_slotts.init({
    barber_id: DataTypes.INTEGER,
    week_id: DataTypes.INTEGER,
    day_id: DataTypes.INTEGER,
    time_from: DataTypes.STRING,
    time_to: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'time_slotts',
  });
  return time_slotts;
};