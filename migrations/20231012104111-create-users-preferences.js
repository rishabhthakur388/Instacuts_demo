'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users_preferences', {
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
      about_me: {
        type: Sequelize.STRING
      },
      languages: {
        type: Sequelize.STRING
      },
      skills: {
        type: Sequelize.STRING
      },
      stylist_type: {
        type: Sequelize.ENUM('1', '2', '3'),
        comment:('1 => junior','2 => senior', '3=> advanced'),
        allowNull: false
      },
      images: {
        type: Sequelize.STRING
      },
      videos: {
        type: Sequelize.STRING
      },
      work_radius: {
        type: Sequelize.STRING
      },
      active_status: {
        type: Sequelize.BOOLEAN,
        defaultValue:"0"
      },
      available_for: {
        type: Sequelize.ENUM('1','2','3','4'),
        comment:('1 => men','2 => women','3 => kids','4 => seniors'),
        allowNull:false
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
    await queryInterface.dropTable('users_preferences');
  }
};