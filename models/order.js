'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init({
    customer_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    order_status: { type: DataTypes.ENUM('1', '2','3','4','5'),
    defaultValue:'1'},
    payment_type: { type: DataTypes.ENUM('1', '2')},
    sub_total: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    tax_and_charges: DataTypes.FLOAT,
    total_price: DataTypes.FLOAT,
    confirm_order:{type:DataTypes.ENUM('1','2')},
    cancel_service: {type:DataTypes.ENUM('0','1'),
    contact_number: DataTypes.STRING,
    customers_order_id: DataTypes.STRING,
    address_id: DataTypes.INTEGER,
},
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};