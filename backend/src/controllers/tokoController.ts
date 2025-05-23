import { Request, Response, NextFunction } from 'express';
import { Toko } from '../models/Toko';
import { User } from '../models/User';
import { Barang } from '../models/Barang';
import { decryptUserFields } from '../utils/encryption';
import { ApiError } from '../utils/ApiError';

export const getTokoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User not authenticated'));
        }
        const toko = await Toko.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user' },
                { model: Barang, as: 'barang' }
            ]
        });
        if (!toko) {
            return next(new ApiError(404, 'Toko not found'));
        }
        const t = toko.toJSON();
        if (t.user) t.user = decryptUserFields(t.user);
        res.json(t);
    } catch (err) {
        next(new ApiError(500, 'Failed to get toko'));
    }
};

export const getAllTokos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User not authenticated'));
        }
        const tokos = await Toko.findAll({
            include: [
                { model: User, as: 'user' },
                { model: Barang, as: 'barang' }
            ]
        });
        const result = tokos.map(toko => {
            const t = toko.toJSON();
            if (t.user) t.user = decryptUserFields(t.user);
            return t;
        });
        res.json(result);
    } catch (err) {
        next(new ApiError(500, 'Failed to get all tokos'));
    }
};

export const createToko = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User not authenticated'));
        }

        const { namaToko, lokasiToko } = req.body;
        const userId = req.user.userId;

        if (!namaToko || !lokasiToko) {
            return next(new ApiError(400, 'Missing required fields'));
        }

        const existingToko = await Toko.findOne({ where: { userId } });
        if (existingToko) {
            return next(new ApiError(400, 'User already has a toko'));
        }

        const newToko = {
            userId,
            namaToko,
            lokasiToko
        };

        const toko = await Toko.create(newToko);
        res.status(201).json(toko);
    } catch (err) {
        next(new ApiError(500, 'Failed to create toko'));
    }
};

export const updateToko = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User not authenticated'));
        }
        const userId = req.user.userId;
        const toko = await Toko.findOne({ where: { userId } });
        if (!toko) {
            return next(new ApiError(404, 'Toko not found'));
        }

        const { namaToko, lokasiToko } = req.body;
        const updateData: any = {};
        if (namaToko !== undefined) updateData.namaToko = namaToko;
        if (lokasiToko !== undefined) updateData.lokasiToko = lokasiToko;

        await toko.update(updateData);
        res.json(toko);
    } catch (err) {
        next(new ApiError(500, 'Failed to update toko'));
    }
};

export const deleteToko = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User not authenticated'));
        }
        const toko = await Toko.findByPk(req.params.id);
        if (!toko) {
            return next(new ApiError(404, 'Toko not found'));
        }
        await toko.destroy();
        res.status(204).send();
    } catch (err) {
        next(new ApiError(500, 'Failed to delete toko'));
    }
};

export const getCurrentUserTokos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User not authenticated'));
        }
        const userId = req.user.userId;
        const tokos = await Toko.findAll({
            where: { userId },
            include: [
                { model: User, as: 'user' },
                { model: Barang, as: 'barang' }
            ]
        });
        const result = tokos.map(toko => {
            const t = toko.toJSON();
            if (t.user) t.user = decryptUserFields(t.user);
            return t;
        });
        res.json(result);
    } catch (err) {
        next(new ApiError(500, 'Failed to get current user tokos'));
    }
};
