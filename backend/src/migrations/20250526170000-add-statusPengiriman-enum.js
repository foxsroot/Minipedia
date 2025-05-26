"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("order", "statusPengiriman", {
      type: Sequelize.ENUM(
        "PACKED",
        "SHIPPED",
        "DELIVERED",
        "COMPLETED",
        "PENDING"
      ),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert to previous ENUM (remove PENDING if it was not there before)
    await queryInterface.changeColumn("order", "statusPengiriman", {
      type: Sequelize.ENUM("PACKED", "SHIPPED", "DELIVERED", "COMPLETED"),
      allowNull: true,
    });
  },
};
