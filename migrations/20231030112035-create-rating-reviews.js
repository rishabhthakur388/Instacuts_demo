'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rating_reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'users', key: 'id' },
        onDelete: 'cascade',
      },
      comment: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.INTEGER
      },
      barber_id:{
        type: Sequelize.INTEGER,
        reference: { model: 'users', key: 'id' },
        onDelete: 'cascade',
      },
      service_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'custom_services', key: 'id' },
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
    await queryInterface.dropTable('rating_reviews');
  }
};