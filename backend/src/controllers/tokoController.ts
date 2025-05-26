import { Request, Response, NextFunction } from 'express';
import { Barang, Toko, Order, OrderItem } from '../models/index';
import { ApiError } from '../utils/ApiError';
import { Op } from 'sequelize';
import jwt from "jsonwebtoken";

export const getTokoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const toko = await Toko.findByPk(req.params.id, {
            include: [
                {
                    model: Barang,
                    as: 'barang',
                    attributes: ['barangId', 'namaBarang', 'hargaBarang', 'stokBarang', 'deskripsiBarang', 'kategoriProduk', 'diskonProduk']
                }
            ]
        });

        if (!toko) {
            return next(new ApiError(404, 'Toko not found'));
        }

        if (toko.barang && Array.isArray(toko.barang)) {
            toko.barang = toko.barang.map((b: any) => ({
                ...b,
                hargaBarang: Number(b.hargaBarang),
                stokBarang: Number(b.stokBarang),
                diskonProduk: parseFloat(b.diskonProduk),
            }));
        }

        res.json(toko.toJSON());
    } catch (err) {
        next(new ApiError(500, 'Failed to get toko'));
    }
};

export const getAllTokos = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    try {
        const tokos = await Toko.findAll({
            attributes: ['tokoId', 'namaToko', 'lokasiToko'],
        });

        res.json(JSON.stringify(tokos));
    } catch (err) {
        next(new ApiError(500, 'Failed to get all tokos'));
    }
};

export const createToko = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    const userId = req.user.userId;

    try {
        const { namaToko, lokasiToko } = req.body;

        if (!namaToko || !lokasiToko) {
            return next(new ApiError(400, 'Missing required fields'));
        }

        const existingToko = await Toko.findOne({
            where: {
                [Op.or]: [
                    { userId },
                    { namaToko }]
            }
        });

        if (existingToko && existingToko.userId === userId) {
            return next(new ApiError(400, 'User already has a toko'));
        }

        if (existingToko && existingToko.namaToko === namaToko) {
            return next(new ApiError(400, 'Toko with this name already exists'));
        }

        const newToko = {
            userId,
            namaToko,
            lokasiToko
        };

        const toko = await Toko.create(newToko);

        // Generate a new JWT with tokoId
        const JWT_SECRET = process.env.JWT_TOKEN_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in the environment variables.');
        }

        const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '604800', 10);
        const payload = {
            userId,
            tokoId: toko.tokoId
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

        res.status(201).json({ toko, token });
    } catch (err) {
        next(new ApiError(500, 'Failed to create toko'));
    }
};

export const updateToko = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }
    const userId = req.user.userId;

    try {
        const toko = await Toko.findOne({ where: { userId } });

        if (!toko) {
            return next(new ApiError(404, 'Toko not found'));
        }

        const { namaToko, lokasiToko } = req.body;

        if (!namaToko && !lokasiToko) {
            return next(new ApiError(400, 'At least one field (namaToko or lokasiToko) must be provided'));
        }

        toko.namaToko = namaToko || toko.namaToko;
        toko.lokasiToko = lokasiToko || toko.lokasiToko;

        await toko.save();
        await toko.reload();
        res.status(200).json({ toko });
    } catch (err) {
        next(new ApiError(500, 'Failed to update toko'));
    }
};

export const deleteToko = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    try {
        const toko = await Toko.findOne({ where: { userId: req.user.userId } });

        if (!toko) {
            return next(new ApiError(404, 'Toko not found'));
        }

        await toko.destroy();
        res.status(204).json({ message: 'Toko deleted successfully' });
    } catch (err) {
        next(new ApiError(500, 'Failed to delete toko'));
    }
};

export const getCurrentUserToko = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    const userId = req.user.userId;

    try {
        // Find the toko associated with the authenticated user
        const toko = await Toko.findOne({
            where: { userId },
            include: [
                {
                    model: Barang,
                    as: 'barang',
                    attributes: [
                        'barangId',
                        'namaBarang',
                        'hargaBarang',
                        'stokBarang',
                        'deskripsiBarang',
                        'kategoriProduk',
                        'diskonProduk'
                    ],
                },
            ],
        });

        if (!toko) {
            return next(new ApiError(404, 'Toko not found for the current user'));
        }

        // Find all orders that have at least one orderItem with barang from this toko
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Barang,
                            where: { tokoId: toko.tokoId },
                            attributes: ['barangId', 'namaBarang', 'tokoId'],
                        }
                    ]
                }
            ]
        });

        // Format the response
        const formattedToko = {
            tokoId: toko.tokoId,
            namaToko: toko.namaToko,
            lokasiToko: toko.lokasiToko,
            barang: toko.barang.map((b: any) => ({
                barangId: b.barangId,
                namaBarang: b.namaBarang,
                hargaBarang: Number(b.hargaBarang),
                stokBarang: Number(b.stokBarang),
                deskripsiBarang: b.deskripsiBarang,
                kategoriProduk: b.kategoriProduk,
                diskonProduk: parseFloat(b.diskonProduk),
            })),
            orders: orders.map((order: any) => ({
                orderId: order.orderId,
                namaPenerima: order.namaPenerima,
                alamatPengiriman: order.alamatPengiriman,
                statusPengiriman: order.statusPengiriman,
                nomorResi: order.nomorResi,
                waktuTransaksi: order.waktuTransaksi,
                orderItems: order.orderItems.map((item: any) => ({
                    orderItemId: item.orderItemId,
                    barangId: item.barangId,
                    jumlah: item.jumlah,
                    barang: item.barang,
                })),
            })),
        };

        res.status(200).json(formattedToko);
    } catch (err) {
        next(new ApiError(500, 'Failed to get current user toko'));
    }
};
