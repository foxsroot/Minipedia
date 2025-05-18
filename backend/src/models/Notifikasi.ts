import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";

@Table({
    tableName: "notifikasi",
    timestamps: false
})
export class Notifikasi extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false
    })
    declare notifikasiId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare statusOrder: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare judulNotifikasi: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare waktuDikirim: Date;

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

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare userId: string;

    @BelongsTo(() => User)
    declare user: User;
}
