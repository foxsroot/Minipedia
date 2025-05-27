import { Request, Response, NextFunction } from 'express';
import { decryptUserFields } from '../utils/encryption';
import { Order, User, OrderItem, Barang, Toko } from '../models/index';
import { ApiError } from '../utils/ApiError';
import { updateStock } from '../services/updateStock';
import { v4 as uuidv4 } from "uuid";

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
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    try {
        const orders = await Order.findAll({
            where: { userId: req.user.userId }, // Filter orders by the logged-in user's ID
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
        return next(new ApiError(500, 'Failed to get user-specific orders'));
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
        for (const item of req.body.orderItems) {
            const barang = await Barang.findByPk(item.barangId);
            item.persentaseDiskon = barang ? barang.diskonProduk : 0;
        }

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

        const result = await Promise.all(
            req.body.orderItems.map((item: any) => updateStock(item.barangId, -item.quantity))
        );

        if (result instanceof ApiError) {
            return next(result);
        }

        res.status(201).json({
            ...order.toJSON(),
            orderId: order.orderId
        });
    } catch (err) {
        console.error('Error creating order:', err);
        return next(new ApiError(500, err instanceof Error ? err.message : 'Failed to create order'));
    }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                }
            ]
        });

        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }

        if (order.statusPengiriman || order.statusPesanan === null) {
            return next(new ApiError(400, 'Order cannot be deleted if it has been shipped'));
        }

        order.statusPesanan = 'CANCELED';
        await order.save();

        console.log('Order canceled:', order.orderItems);

        for (const item of order.orderItems) {
            const result = await updateStock(item.barangId, item.quantity);
            if (result instanceof ApiError) {
                return next(result);
            }
        }
        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (err) {
        return next(new ApiError(500, 'Failed to cancel order'));
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const { statusPengiriman } = req.body;

        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                }
            ]
        });
        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        if (statusPengiriman === "PACKED" && !order.nomorResi) {
            order.nomorResi = uuidv4();
        }

        if (statusPengiriman === "SHIPPED") {
            for (const item of order.orderItems) {
                await updateStock(item.barangId, -item.quantity);
            }
        }

        order.statusPengiriman = statusPengiriman;
        await order.save();

        res.json({ message: "Order status updated", nomorResi: order.nomorResi });
    } catch (err) {
        return next(new ApiError(500, err instanceof Error ? err.message : "Failed to update order status"));
    }
};

export const getTokoAllOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    try {
        const orders = await Order.findAll({
            // No direct where condition on Order since it does not contain tokoId
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['nama', 'email', 'nomorTelpon', 'username']
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    required: true, // only include orders that have matching orderItems
                    include: [
                        {
                            model: Barang,
                            as: 'barang',
                            where: { tokoId: req.user.tokoId }, // filter orderItems by barang belonging to current user's toko
                            attributes: ['barangId', 'namaBarang', 'tokoId']
                        }
                    ]
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
        return next(new ApiError(500, 'Failed to get orders for current user toko'));
    }
};


