import { Request, Response, NextFunction } from 'express';
import { Notifikasi } from '../models/Notifikasi';
import { User } from '../models/User';
import { decryptUserFields } from '../utils/encryption';

export const getNotifikasiById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifikasi = await Notifikasi.findByPk(req.params.id, { include: [User] });
        if (!notifikasi) {
            res.status(404).json({ message: 'Notifikasi not found' });
            return
        }
        const n = notifikasi.toJSON();
        if (n.user) n.user = decryptUserFields(n.user);
        res.json(n);
    } catch (err) {
        next(err);
    }
};

export const getAllNotifikasis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifikasis = await Notifikasi.findAll({ include: [User] });
        const result = notifikasis.map(notifikasi => {
            const n = notifikasi.toJSON();
            if (n.user) n.user = decryptUserFields(n.user);
            return n;
        });
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const createNotifikasi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifikasi = await Notifikasi.create(req.body);
        res.status(201).json(notifikasi);
    } catch (err) {
        next(err);
    }
};

export const updateNotifikasi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifikasi = await Notifikasi.findByPk(req.params.id);
        if (!notifikasi) {
            res.status(404).json({ message: 'Notifikasi not found' });
            return;
        }
        await notifikasi.update(req.body);
        res.json(notifikasi);
    } catch (err) {
        next(err);
    }
};

export const deleteNotifikasi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifikasi = await Notifikasi.findByPk(req.params.id);
        if (!notifikasi) {
            res.status(404).json({ message: 'Notifikasi not found' });
            return;
        }
        await notifikasi.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
