import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { User } from "./User";
import { Barang } from "./Barang";

@Table({
    tableName: "toko",
    timestamps: false,
    paranoid: true,
    deletedAt: "deleted_at"
})
export class Toko extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare tokoId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare userId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare namaToko: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare lokasiToko: string;

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

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'deleted_at'
    })
    declare deletedAt: Date | null;

    @BelongsTo(() => User)
    declare user: User;

    @HasMany(() => Barang)
    declare barang: Barang[];
}
