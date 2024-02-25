'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('time_slotts', {
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
      time_from: {
        type: Sequelize.STRING
      },
      time_to: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('time_slotts');
  }
};