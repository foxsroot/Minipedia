'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('barangs', {
      barangId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      namaBarang: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deskripsiBarang: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      stokBarang: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hargaBarang: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      kategoriProduk: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tokoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'tokos', key: 'tokoId' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('barangs');
  }
};
