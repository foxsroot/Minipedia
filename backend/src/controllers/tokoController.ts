import { Request, Response, NextFunction } from 'express';
import { Toko } from '../models/Toko';
import { User } from '../models/User';
import { Barang } from '../models/Barang';
import { decryptUserFields } from '../utils/encryption';

export const getTokoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const toko = await Toko.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user' },
                { model: Barang, as: 'barangs' }
            ]
        });
        if (!toko) {
            res.status(404).json({ message: 'Toko not found' });
            return;
        }
        const t = toko.toJSON();
        if (t.user) t.user = decryptUserFields(t.user);
        res.json(t);
    } catch (err) {
        next(err);
    }
};

export const getAllTokos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokos = await Toko.findAll({
            include: [
                { model: User, as: 'user' },
                { model: Barang, as: 'barangs' }
            ]
        });
        const result = tokos.map(toko => {
            const t = toko.toJSON();
            if (t.user) t.user = decryptUserFields(t.user);
            return t;
        });
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const createToko = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const toko = await Toko.create(req.body);
        res.status(201).json(toko);
    } catch (err) {
        next(err);
    }
};

export const updateToko = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const toko = await Toko.findByPk(req.params.id);
        if (!toko) {
            res.status(404).json({ message: 'Toko not found' });
            return;
        }
        await toko.update(req.body);
        res.json(toko);
    } catch (err) {
        next(err);
    }
};

export const deleteToko = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const toko = await Toko.findByPk(req.params.id);
        if (!toko) {
            res.status(404).json({ message: 'Toko not found' });
            return;
        }
        await toko.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
