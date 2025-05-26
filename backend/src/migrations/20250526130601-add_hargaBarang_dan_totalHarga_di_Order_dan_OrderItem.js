'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add hargaBarang to OrderItem
    await queryInterface.addColumn('OrderItems', 'hargaBarang', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    });
    // Add totalHarga to Order
    await queryInterface.addColumn('Orders', 'totalHarga', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove hargaBarang from OrderItem
    await queryInterface.removeColumn('OrderItems', 'hargaBarang');
    // Remove totalHarga from Order
    await queryInterface.removeColumn('Orders', 'totalHarga');
  }
};
