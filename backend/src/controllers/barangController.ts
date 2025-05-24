import { Request, Response, NextFunction } from 'express';
import { Barang } from '../models/Barang';
import { Toko } from '../models/Toko';
import { ApiError } from '../utils/ApiError';

export const getBarangById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const barang = await Barang.findByPk(req.params.id, { include: [Toko] });

        if (!barang) {
            return next(new ApiError(404, 'Barang not found'));
        }

        res.status(200).json(barang);
    } catch (err) {
        return next(new ApiError(500, 'Failed to retrieve barang'));
    }
};

export const getAllBarangs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const barang = await Barang.findAll({
            include: {
                model: Toko,
                as: 'toko',
                attributes: ['namaToko', 'lokasiToko']
            }
        });

        res.status(200).json(barang);
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
