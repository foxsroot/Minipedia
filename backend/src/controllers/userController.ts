import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Toko } from '../models/Toko';
import { encryptField, decryptUserFields } from '../utils/encryption';

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id, { include: [Toko] });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const decryptedUser = decryptUserFields(user);
        res.json(decryptedUser);
    } catch (err) {
        next(err);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll({ include: [Toko] });
        const decryptedUsers = users.map(user => {
            const dec = decryptUserFields(user);
            return dec;
        });
        res.json(decryptedUsers);
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Encrypt updated fields if present
        const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;
        if (!ENCRYPT_SECRET || ENCRYPT_SECRET.length !== 64) {
            return next(new Error('ENCRYPT_SECRET must be a 64-character hex string'));
        }
        const updateData: any = { ...req.body };
        if (updateData.username) updateData.username = encryptField(updateData.username, ENCRYPT_SECRET);
        if (updateData.email) updateData.email = encryptField(updateData.email, ENCRYPT_SECRET);
        if (updateData.nama) updateData.nama = encryptField(updateData.nama, ENCRYPT_SECRET);
        if (updateData.nomorTelpon) updateData.nomorTelpon = encryptField(updateData.nomorTelpon, ENCRYPT_SECRET);
        if (updateData.statusMember) updateData.statusMember = encryptField(updateData.statusMember, ENCRYPT_SECRET);
        // Do not update password here (should be a separate endpoint)
        await user.update(updateData);
        const decryptedUser = decryptUserFields(user);
        res.json(decryptedUser);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        await user.destroy();
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};
