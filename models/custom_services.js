'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class custom_services extends Model {

    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      custom_services.belongsTo(models.users_preferences,{
        foreignKey:"id"
      })
      custom_services.belongsTo(models.rating_reviews,{
        foreignKey:"id"
      })
      custom_services.hasMany(models.time_slotts,{
        foreignKey:"barber_id",
        // as : 'barbarTimeSlots'
      })
      custom_services.hasMany(models.cart,{
        foreignKey:"service_id",
        // as : 'barbarTimeSlots'
      })
      custom_services.hasMany(models.schedule,{
        foreignKey:"barber_id",
        // as : 'barbarTimeSlots'
      })
    
    }
  }
  custom_services.init({
    barber_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    sale_price: DataTypes.FLOAT,
    images: DataTypes.STRING,
    videos: DataTypes.STRING,
    available_for: DataTypes.ENUM('1','2','3')
  }, {
    sequelize,
    modelName: 'custom_services',
  });
  return custom_services;
};