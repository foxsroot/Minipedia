import { Request, Response, NextFunction } from 'express';
import { User, Toko } from '../models/index';
import { encryptField, decryptUserFields } from '../utils/encryption';
import { ApiError } from '../utils/ApiError';

// export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await User.findByPk(req.params.id, { include: [Toko] });

//         if (!user) {
//             return next(new ApiError(404, 'User not found'));
//         }

//         const decryptedUser = decryptUserFields(user);
//         res.json(decryptedUser);
//     } catch (err) {
//         next(new ApiError(500, 'Failed to get user by id'));
//     }
// };

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);

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

        await user.update(updateData);

        const updatedUser = decryptUserFields(user);

        res.status(200).json({
            nama: updatedUser.nama,
            email: updatedUser.email,
            nomorTelpon: updatedUser.nomorTelpon,
            username: updatedUser.username,
            Toko,
        });
    } catch (err) {
        next(new ApiError(500, 'Failed to update user'));
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);

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
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId, {
            attributes: ["userId", "nama", "email", "nomorTelpon", "username"],
            include: [
                {
                    model: Toko,
                    as: 'toko',
                    attributes: ["namaToko","lokasiToko", "tokoId"]
                }
            ]
        });

        if (!user) {
            return next(new ApiError(404, "User not found " + userId));
        }

        const decryptedUser = decryptUserFields(user);

        res.json({
            nama: decryptedUser.nama,
            email: decryptedUser.email,
            nomorTelpon: decryptedUser.nomorTelpon,
            username: decryptedUser.username,
            Toko: decryptedUser.toko ? {
                tokoId: decryptedUser.toko.tokoId,
                namaToko: decryptedUser.toko.namaToko,
                lokasiToko: decryptedUser.toko.lokasiToko
            } : null
        });
    } catch (err) {
        next(new ApiError(500, 'Failed to get current user'));
    }
};
