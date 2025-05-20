import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { OrderItem } from '../models/OrderItem';
import { Barang } from '../models/Barang';
import { decryptUserFields } from '../utils/encryption';

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user' },
                { model: OrderItem, as: 'orderItems', include: [Barang] }
            ]
        });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        const o = order.toJSON();
        if (o.user) o.user = decryptUserFields(o.user);
        res.json(o);
    } catch (err) {
        next(err);
    }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, as: 'user' },
                { model: OrderItem, as: 'orderItems', include: [Barang] }
            ]
        });
        const result = orders.map(order => {
            const o = order.toJSON();
            if (o.user) o.user = decryptUserFields(o.user);
            return o;
        });
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.create(req.body, { include: [OrderItem] });
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        await order.update(req.body);
        res.json(order);
    } catch (err) {
        next(err);
    }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        await order.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
