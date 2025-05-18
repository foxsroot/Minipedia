import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Order } from "./Order";

@Table({
    tableName: "laporan",
    timestamps: false
})
export class Laporan extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false
    })
    declare laporanId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare kategoriLaporan: string;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    declare tanggalLaporanDiselesaikan: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare tanggalLaporanMasuk: Date;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare deskripsiMasalah: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare buktiBarang: string;

    @ForeignKey(() => Order)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare orderId: string;

    @BelongsTo(() => Order)
    declare order: Order;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare updatedAt: Date;
}
