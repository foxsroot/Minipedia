import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import { Order } from "./Order";
import { Barang } from "./Barang";

@Table({
    tableName: "order_item",
    timestamps: false
})
export class OrderItem extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false
    })
    declare orderItemId: string;

    @ForeignKey(() => Order)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare orderId: string;

    @ForeignKey(() => Barang)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare barangId: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare quantity: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true
    })
    declare persentaseDiskon: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    declare hargaBarang: number;

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

    @BelongsTo(() => Order)
    declare order: Order;

    @BelongsTo(() => Barang)
    declare barang: Barang;
}
