import path from 'path';
import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { User } from './User';
import { Toko } from './Toko';
import { Barang } from './Barang';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    models: [User, Toko, Barang, Order, OrderItem],
});

export { sequelize };