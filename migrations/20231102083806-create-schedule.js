'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      barber_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'users', key: 'id' },
        onDelete: 'cascade',
      },
      service_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'users', key: 'id' },
        onDelete: 'cascade',
      },
      week_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'weeks', key: 'id' },
        onDelete: 'cascade',
      },
      day_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'days', key: 'id' },
        onDelete: 'cascade',
      },
      time_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'time_slotts', key: 'id' },
        onDelete: 'cascade',
      },
      availability: {
        type: Sequelize.ENUM('0','1'),
        comment:('0 => no','1 =>yes ')
      },
      customer_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'users', key: 'id' },
        onDelete: 'cascade',
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
    await queryInterface.dropTable('schedules');
  }
};