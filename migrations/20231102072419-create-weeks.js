'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('weeks', {
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
      week_one: {
        type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
      },
      week_two: {
        type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
      },
      week_three: {
        type: Sequelize.ENUM('0','1'),
        comment:('0 => notavailable ','1 => available'),
        defaultValue:'0'
      },
      week_four: {
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
    await queryInterface.dropTable('weeks');
  }
};