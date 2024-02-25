'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('days', {
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
        monday: {
          type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
        },
        tuesday: {
          type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
        },
        wednesday: {
          type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
        },
        thursday: {
          type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
        },
        friday: {
          type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
        },
        saturday: {
          type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
        },
        sunday: {
          type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
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
    await queryInterface.dropTable('days');
  }
};