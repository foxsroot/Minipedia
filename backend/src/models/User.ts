import { Table, Column, Model, DataType, HasOne, HasMany } from "sequelize-typescript";
import { Toko } from "./Toko";
import { Order } from "./Order";

@Table({
    tableName: "user",
    timestamps: false,
    paranoid: true,
    deletedAt: "deleted_at"
})
export class User extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false
    })
    declare userId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare nama: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare nomorTelpon: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string;

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

    @HasOne(() => Toko)
    declare toko?: Toko;

    @HasMany(() => Order)
    declare order?: Order[];
}
