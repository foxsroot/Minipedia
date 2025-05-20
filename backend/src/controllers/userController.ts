import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Toko } from '../models/Toko';
import { decryptUserFields } from '../utils/encryption';

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
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
        await user.update(req.body);
        // Return decrypted user
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
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
