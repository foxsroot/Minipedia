import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { OrderItem } from "./OrderItem";
import { User } from "./User";

@Table({
    tableName: "order",
    timestamps: false
})
export class Order extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false
    })
    declare orderId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare userId: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare waktuTransaksi: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare alamatPengiriman: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare namaPenerima: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare statusPesanan: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare nomorResi: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare nomorTelpon: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare penerima: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare pengiriman: string;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    declare tanggalBarangDiterima: Date;

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

    @BelongsTo(() => User)
    declare user: User;

    @HasMany(() => OrderItem)
    declare orderItems: OrderItem[];
}
