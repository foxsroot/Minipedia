'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('laporans', {
      laporanId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      kategoriLaporan: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tanggalLaporanDiselesaikan: {
        type: Sequelize.DATE,
        allowNull: true
      },
      tanggalLaporanMasuk: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      deskripsiMasalah: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      buktiBarang: {
        type: Sequelize.STRING,
        allowNull: true
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'orders', key: 'orderId' },
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
    await queryInterface.dropTable('laporans');
  }
};
