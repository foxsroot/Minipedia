import { Request, Response, NextFunction } from 'express';
import { Barang, Toko, OrderItem, Order } from '../models/index';
import { ApiError } from '../utils/ApiError';

export const getBarangById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const barang = await Barang.findByPk(req.params.id, { include: [Toko] });

        if (!barang) {
            return next(new ApiError(404, 'Barang not found'));
        }

        const orderItems = await OrderItem.findAll({
            where: { barangId: req.params.id },
            include: [Order]
        });

        let jumlahTerjual = 0;
        orderItems.forEach(item => {
            if (item.order && item.order.statusPesanan !== 'CANCELED') {
                jumlahTerjual += item.quantity;
            }
        });

        res.status(200).json({
            ...barang.toJSON(),
            jumlahTerjual
        });
    } catch (err) {
        return next(new ApiError(500, 'Failed to retrieve barang'));
    }
};

export const getAllBarangs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const barangs = await Barang.findAll({
            include: [
                {
                    model: Toko,
                    as: 'toko',
                    attributes: ['namaToko', 'lokasiToko']
                }
            ],
        });

        const barangIds = barangs.map(b => b.barangId);

        const orderItems = await OrderItem.findAll({
            where: { barangId: barangIds },
            include: [Order]
        });

        const jumlahTerjualMap: { [key: string]: number } = {};

        orderItems.forEach(item => {
            const id = item.barangId;

            if (item.order.statusPesanan != 'CANCELED') {
                jumlahTerjualMap[id] = (jumlahTerjualMap[id] || 0) + item.quantity;
            }
        });

        const result = barangs.map(barang => ({
            ...barang.toJSON(),
            jumlahTerjual: jumlahTerjualMap[barang.barangId] || 0
        }));

        res.status(200).json(result);
    } catch (err) {
        return next(new ApiError(500, 'Failed to retrieve barang'));
    }
};

export const createBarang = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    const tokoId = req.user.tokoId;

    try {
        const hargaBarangNumber = parseFloat(req.body.hargaBarang);

        if (isNaN(hargaBarangNumber) || hargaBarangNumber < 0) {
            return next(new ApiError(400, 'Invalid hargaBarang format'));
        }
    } catch (err) {
        return next(new ApiError(400, 'Invalid hargaBarang format'));
    }

    if (req.body.hargaBarang <= 0) {
        return next(new ApiError(400, 'User doesn\'t have a toko'));
    }

    try {
        // If file is uploaded, set fotoBarang to the uploaded file's filename
        if (req.file) {
            req.body.fotoBarang = `${req.file.filename}`;
        } else {
            return next(new ApiError(400, 'Foto barang harus diupload'));
        }
        console.log("barang : ", req.body);
        console.log("file : ", req.file);

        const barang = await Barang.create(
            {
                namaBarang: req.body.namaBarang,
                hargaBarang: req.body.hargaBarang,
                stokBarang: req.body.stokBarang,
                deskripsiBarang: req.body.deskripsiBarang,
                kategoriProduk: req.body.kategoriProduk,
                fotoBarang: req.body.fotoBarang,
                tokoId: tokoId,
            }
        );
        res.status(201).json({
            ...barang.toJSON(),
            barangId: barang.barangId
        });
    } catch (err) {
        console.error(err);
        return next(new ApiError(500, 'Failed to create barang'));
    }
};

export const updateBarang = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    const tokoId = req.user.tokoId;

    if (!tokoId) {
        return next(new ApiError(400, 'User doesn\'t have a toko'));
    }

    try {
        const barang = await Barang.findByPk(req.params.id);

        if (!barang) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }

        if (barang.tokoId !== tokoId) {
            return next(new ApiError(403, 'Forbidden: You do not have permission to update this barang'));
        }

        // If a new file is uploaded, update fotoBarang
        if (req.file) {
            req.body.fotoBarang = `${req.file.filename}`;
        }

        await barang.update(req.body);
        res.status(200).json(barang);
    } catch (err) {
        return next(new ApiError(500, 'Failed to update barang'));
    }
};

export const deleteBarang = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    const tokoId = req.user.tokoId;

    if (!tokoId) {
        return next(new ApiError(400, 'User doesn\'t have a toko'));
    }

    try {
        const barang = await Barang.findByPk(req.params.id);

        if (!barang) {
            return next(new ApiError(404, 'Barang not found'));
        }

        if (barang.tokoId !== tokoId) {
            return next(new ApiError(403, 'Forbidden: You do not have permission to delete this barang'));
        }

        await barang.destroy();
        res.status(204).send();
    } catch (err) {
        return next(new ApiError(500, 'Failed to delete barang'));
    }
};
