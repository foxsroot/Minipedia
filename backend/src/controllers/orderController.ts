import { Request, Response, NextFunction } from 'express';
import { decryptUserFields } from '../utils/encryption';
import { Order, User, OrderItem, Barang, Toko } from '../models/index';
import { ApiError } from '../utils/ApiError';

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['nama', 'email', 'nomorTelpon', 'username']
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [Barang]
                }
            ]
        });

        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }

        const o = order.toJSON();

        if (o.user) o.user = decryptUserFields(o.user);

        res.status(200).json(o);
    } catch (err) {
        return next(new ApiError(500, 'Failed to get order'));
    }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['nama', 'email', 'nomorTelpon', 'username']
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [Barang]
                }
            ]
        });

        const result = orders.map(order => {
            const o = order.toJSON();

            if (o.user) o.user = decryptUserFields(o.user);
            return o;
        });

        res.json(result);
    } catch (err) {
        return next(new ApiError(500, 'Failed to get all orders'));
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    req.body.userId = req.user.userId;

    if (!req.body.orderItems || !Array.isArray(req.body.orderItems) || req.body.orderItems.length === 0) {
        return next(new ApiError(400, 'Order must contain at least one order item'));
    }

    try {
        const order = await Order.create(
            {
                ...req.body,
                orderItems: req.body.orderItems
            },
            {
                include: [
                    {
                        model: OrderItem,
                        as: 'orderItems'
                    }
                ]
            }
        );

        res.status(201).json({
            ...order.toJSON(),
            orderId: order.orderId
        });
    } catch (err) {
        console.error('Error creating order:', err);
        return next(new ApiError(500, err instanceof Error ? err.message : 'Failed to create order'));
    }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    if (!req.body.tanggalBarangDiterima && !req.body.statusPengiriman && !req.body.statusPesanan) {
        return next(new ApiError(400, 'At least one field must be updated'));
    }

    try {
        const order = await Order.findByPk(
            req.params.id,
            {
                include: [
                    {
                        model: OrderItem,
                        as: 'orderItems',
                        include: [
                            {
                                model: Barang,
                                include: [
                                    {
                                        model: Toko
                                    }
                                ]
                            }
                        ]
                    }
                ]

            }
        );

        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }

        if (order.orderItems[0].barang.toko.userId !== req.user.userId) {
            return next(new ApiError(403, 'Forbidden: You do not have permission to update this order'));
        }

        if (req.body.tanggalBarangDiterima) {
            order.tanggalBarangDiterima = req.body.tanggalBarangDiterima;
        }

        if (req.body.statusPengiriman) {
            order.statusPengiriman = req.body.statusPengiriman;
        }

        if (req.body.statusPesanan) {
            order.statusPesanan = req.body.statusPesanan;
        }

        await order.save();
        await order.reload();
        res.status(200).json(order);
    } catch (err) {
        // return next(new ApiError(500, 'Failed to update order'));
        return next(new ApiError(500, err instanceof Error ? err.message : 'Failed to create order'));
    }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }

        if (order.statusPengiriman) {
            return next(new ApiError(400, 'Order cannot be deleted if it has been shipped'));
        }

        await order.destroy();
        res.status(204).json({ message: 'Order deleted successfully' });
    } catch (err) {
        return next(new ApiError(500, 'Failed to delete order'));
    }
};


