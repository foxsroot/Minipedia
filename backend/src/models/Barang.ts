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
        type: DataType.STRING,
        allowNull: true,
        field: 'foto_barang',
    })
    declare fotoBarang: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare deskripsiBarang: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare stokBarang: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    declare hargaBarang: number;

    @Column({
        type: DataType.ENUM("ELECTRONICS", "FASHION", "BEAUTY_HEALTH", "HOME_LIVING", "AUTOMOTIVE", "SPORTS_OUTDOORS", "HOBBIES", "BOOKS", "BABY_TOYS", "FOOD_BEVERAGES", "OFFICE_SUPPLIES", "OTHER"),
        allowNull: false
    })
    declare kategoriProduk: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        defaultValue: 0
    })
    declare diskonProduk: number;

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
