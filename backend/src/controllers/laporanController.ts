import { Request, Response, NextFunction } from 'express';
import { Laporan } from '../models/Laporan';
import { Order } from '../models/Order';

export const getLaporanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laporan = await Laporan.findByPk(req.params.id, { include: [Order] });
        if (!laporan) {
            res.status(404).json({ message: 'Laporan not found' });
            return;
        }
        res.json(laporan);
    } catch (err) {
        next(err);
    }
};

export const getAllLaporans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laporans = await Laporan.findAll({ include: [Order] });
        res.json(laporans);
    } catch (err) {
        next(err);
    }
};

export const createLaporan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laporan = await Laporan.create(req.body);
        res.status(201).json(laporan);
    } catch (err) {
        next(err);
    }
};

export const updateLaporan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laporan = await Laporan.findByPk(req.params.id);
        if (!laporan) {
            res.status(404).json({ message: 'Laporan not found' });
            return;
        }
        await laporan.update(req.body);
        res.json(laporan);
    } catch (err) {
        next(err);
    }
};

export const deleteLaporan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laporan = await Laporan.findByPk(req.params.id);
        if (!laporan) {
            res.status(404).json({ message: 'Laporan not found' });
            return;
        } 
        await laporan.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
