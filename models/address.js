'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  address.init({
    name: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    address_line1: DataTypes.STRING,
    address_line2: DataTypes.STRING,
    landmark: DataTypes.STRING,
    town_city: DataTypes.STRING,
    state: DataTypes.STRING,
    pincode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'address',
  });
  return address;
};