'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mobile_number: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM('male','female')
      },
      dob: {
        type: Sequelize.DATE
      },
      service_category: {
        type: Sequelize.STRING
      },
      specialization: {
        type: Sequelize.STRING
      },
      experience: {
        type: Sequelize.STRING
      },
      address_1: {
        type: Sequelize.STRING
      },
      address_2: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      ssn_number: {
        type: Sequelize.STRING
      },
      cosmetology_license: {
        type: Sequelize.STRING
      },
      driving_license: {
        type: Sequelize.STRING
      },
      profile_pic: {
        type: Sequelize.STRING
      },
      zip_code: {
        type: Sequelize.INTEGER
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      confirm_acc_status: {
        type: Sequelize.BOOLEAN,
        defaultValue:"0"
      },
      admin_confirmation: {
        type: Sequelize.ENUM('1','2','3'),
        comment:('1 => pending','2 => accept','3 => reject')
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
    await queryInterface.dropTable('users');
  }
};