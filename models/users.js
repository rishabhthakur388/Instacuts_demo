'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.belongsTo(models.custom_services,{
        foreignKey:"id"
      })
      users.belongsTo(models.rating_reviews,{
        foreignKey:"id"
      })
      users.hasMany(models.users_preferences,{
        foreignKey:"barber_id"
      })
      users.hasMany(models.schedule,{
        foreignKey:"barber_id"
      })
      users.hasMany(models.time_slotts,{
        foreignKey:"barber_id"
      })
      users.hasMany(models.weeks,{
        foreignKey:"barber_id"
      })
      users.hasMany(models.days,{
        foreignKey:"barber_id"
      })
    }

  }
  users.init({
    mobile_number: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.ENUM('male', 'female'),
    dob: DataTypes.DATE,
    password: DataTypes.STRING,
    service_category: DataTypes.STRING,
    specialization: DataTypes.STRING,
    experience: DataTypes.STRING,
    address_1: DataTypes.STRING,
    address_2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    ssn_number: DataTypes.STRING,
    cosmetology_license: DataTypes.STRING,
    driving_license: DataTypes.STRING,
    profile_pic: DataTypes.STRING,
    zip_code: DataTypes.INTEGER,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    work_radius: DataTypes.INTEGER,
    confirm_acc_status: DataTypes.BOOLEAN,
    admin_confirmation:{type:DataTypes.ENUM('1','2','3'),
    defaultValue:"1"}
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};