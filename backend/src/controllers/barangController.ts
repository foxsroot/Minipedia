import { Request, Response, NextFunction } from 'express';
import { Barang } from '../models/Barang';
import { Toko } from '../models/Toko';

export const getBarangById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const barang = await Barang.findByPk(req.params.id, { include: [Toko] });
        if (!barang) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        res.json(barang);
    } catch (err) {
        next(err);
    }
};

export const getAllBarangs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const barangs = await Barang.findAll({ include: [Toko] });
        res.json(barangs);
    } catch (err) {
        next(err);
    }
};

export const createBarang = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const barang = await Barang.create(req.body);
        res.status(201).json(barang);
    } catch (err) {
        next(err);
    }
};

export const updateBarang = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const barang = await Barang.findByPk(req.params.id);
        if (!barang) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        await barang.update(req.body);
        res.json(barang);
    } catch (err) {
        next(err);
    }
};

export const deleteBarang = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const barang = await Barang.findByPk(req.params.id);
        if (!barang) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        await barang.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
