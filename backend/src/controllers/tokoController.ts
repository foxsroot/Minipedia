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
        // Check authentication
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User not authenticated'));
        }

        const { namaToko, lokasiToko, statusToko } = req.body;
        const userId = req.user.userId; // Use authenticated user's ID

        if (!namaToko || !lokasiToko || !statusToko) {
            return next(new ApiError(400, 'Missing required fields'));
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }
        const existingToko = await Toko.findOne({ where: { userId } });
        if (existingToko) {
            return next(new ApiError(400, 'User already has a toko'));
        }
        const newToko = {
            userId,
            namaToko,
            lokasiToko,
            statusToko
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
        const toko = await Toko.findByPk(req.params.id);
        if (!toko) {
            return next(new ApiError(404, 'Toko not found'));
        }
        await toko.update(req.body);
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
