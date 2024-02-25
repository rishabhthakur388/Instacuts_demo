'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_adresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customer_adresses.init({
    customer_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    Place_namw: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customer_adresses',
  });
  return customer_adresses;
};