import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { Toko } from "./Toko";
import { OrderItem } from "./OrderItem";

@Table({
    tableName: "barang",
    timestamps: false
})
export class Barang extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false
    })
    declare barangId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare namaBarang: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare deskripsiBarang: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare stokBarang: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare hargaBarang: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare kategoriProduk: string;

    @ForeignKey(() => Toko)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare tokoId: string;

    @BelongsTo(() => Toko)
    declare toko: Toko;

    @HasMany(() => OrderItem)
    declare orderItems: OrderItem[];

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
