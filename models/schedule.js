'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      schedule.belongsTo(models.weeks,{
        foreignKey:"week_id"
      })
      schedule.belongsTo(models.days,{
        foreignKey:"day_id"
      })
      schedule.belongsTo(models.time_slotts,{
        foreignKey:"time_id"
      })
      schedule.belongsTo(models.custom_services,{
        foreignKey:"barber_id"
      })
    }
  }
  schedule.init({
    barber_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    week_id: DataTypes.INTEGER,
    day_id: DataTypes.INTEGER,
    time_id: DataTypes.INTEGER,
    availability: DataTypes.ENUM('0','1'),
    customer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'schedule',
  });
  return schedule;
};