'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      service_id: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      order_status: {
        type: Sequelize.ENUM('1', '2', '3'),
        comment:('1 =>pending','2 => confirm', '3=> cancel'),
        allowNull: false
      },
      sub_total: {
        type: Sequelize.FLOAT
      },
      discount: {
        type: Sequelize.FLOAT
      },
      tax_and_charges: {
        type: Sequelize.FLOAT
      },
      totalpayable: {
        type: Sequelize.FLOAT
      },
      confirm_order: {
        type: Sequelize.ENUM('1', '2', '3'),
        comment:('1 => accepted','2 =>rejected', '3=> pending'),
        allowNull: false
      },
      cancel_service: {
        type: Sequelize.ENUM('0', '1'),
        comment:('0 => accepted ','2 => cancled'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};