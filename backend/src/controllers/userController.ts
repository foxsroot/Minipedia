import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Toko } from '../models/Toko';
import { encryptField, decryptUserFields } from '../utils/encryption';
import { ApiError } from '../utils/ApiError';

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id, { include: [Toko] });
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }
        const decryptedUser = decryptUserFields(user);
        res.json(decryptedUser);
    } catch (err) {
        next(new ApiError(500, 'Failed to get user by id'));
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }
        const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;
        if (!ENCRYPT_SECRET || ENCRYPT_SECRET.length !== 64) {
            return next(new ApiError(500, 'ENCRYPT_SECRET must be a 64-character hex string'));
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
        next(new ApiError(500, 'Failed to update user'));
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }
        await user.destroy();
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (err) {
        next(new ApiError(500, 'Failed to delete user'));
    }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User not authenticated'));
        }
        const userId = req.user.userId;
        if (!userId) {
            return next(new ApiError(401, "Unauthorized"));
        }
        const user = await User.findByPk(userId, { include: [Toko] });
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        // Dekripsi hanya field nama
        let nama = user.nama;
        try {
            const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;
            if (ENCRYPT_SECRET && ENCRYPT_SECRET.length === 64) {
                nama = decryptUserFields({ nama: user.nama }).nama;
            }
        } catch (e) {
            // Jika gagal dekripsi, gunakan value asli
        }

        const hasToko = !!user.toko;

        res.json({
            nama,
            hasToko,
            userId: user.userId,
        });
    } catch (err) {
        console.error("getCurrentUser error:", err);
        next(new ApiError(500, 'Failed to get current user'));
    }
};
