'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('order', {
      orderId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'user', key: 'userId' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      waktuTransaksi: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      alamatPengiriman: {
        type: Sequelize.STRING,
        allowNull: false
      },
      namaPenerima: {
        type: Sequelize.STRING,
        allowNull: false
      },
      statusPesanan: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nomorResi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nomorTelpon: {
        type: Sequelize.STRING,
        allowNull: false
      },
      penerima: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pengiriman: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tanggalBarangDiterima: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('order');
  }
};
