import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { decryptUserFields, encryptField } from "../utils/encryption";
import { Toko } from "../models";

const redis = new Redis();

export async function register(req: Request, res: Response, next: NextFunction) {
    const { username, email, password, nama, nomorTelpon } = req.body;

    if (!username && username != '' || !email && email != '' || !password && password  != '' || !nama && nama != '' || !nomorTelpon && nomorTelpon != '') {
        return next(new ApiError(400, 'All fields are required'));
    }

    try {
        const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!ENCRYPT_SECRET || ENCRYPT_SECRET.length !== 64) {
            return next(new ApiError(500, 'ENCRYPT_SECRET must be a 64-character hex string'));
        }

        // const encryptedEmail = encryptField(email, ENCRYPT_SECRET);
        // const existingUser = await User.findOne({ where: { email: encryptedEmail } });

        const allUsers = await User.findAll({ paranoid: false }); // include soft-deleted for uniqueness check
        let existingUser = null;
        for (const u of allUsers) {
            const decryptedEmail = decryptUserFields(u).email;
            if (decryptedEmail === email) {
                existingUser = u;
                break;
            }
        }

        if (existingUser) {
            return next(new ApiError(409, 'Email already registered'));
        }

        const encryptedUser = {
            username: encryptField(username, ENCRYPT_SECRET),
            email: encryptField(email, ENCRYPT_SECRET),
            nama: encryptField(nama, ENCRYPT_SECRET),
            nomorTelpon: encryptField(nomorTelpon, ENCRYPT_SECRET),
            password: hashedPassword,
            waktuJoin: new Date(),
        };

        const user = await User.create(encryptedUser);
        res.status(201).json({ message: 'Registration successful', userId: user.userId });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ApiError(400, 'Email and password are required'));
        }

        const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;

        if (!ENCRYPT_SECRET || ENCRYPT_SECRET.length !== 64) {
            return next(new ApiError(500, 'ENCRYPT_SECRET Not Defined or Invalid'));
        }

        const users = await User.findAll();
        let user = null;

        for (const u of users) {
            const decryptedEmail = decryptUserFields(u).email;
            if (decryptedEmail === email) {
                user = u;
                break;
            }
        }

        if (!user) {
            console.log('User not found');
            return next(new ApiError(401, 'Invalid email or password'));
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            console.log('Invalid password');
            return next(new ApiError(401, 'Invalid email or password'));
        }

        const payload = {
            userId: user.userId,
            tokoId: ""
        };

        const toko = await Toko.findOne({
            where: { userId: user.userId },
        })

        if (toko) {
            payload.tokoId = toko.tokoId;
        }

        const JWT_SECRET = process.env.JWT_TOKEN_SECRET;

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in the environment variables.');
        }

        const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '604800', 10);
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        return next(new ApiError(500, 'Login failed'));
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return next(new ApiError(400, "Token is required for logout"));
        }

        const JWT_SECRET = process.env.JWT_TOKEN_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }

        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return next(new ApiError(400, "Token already logged out / blacklisted"));
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { exp: number };
        const expirationTime = decoded.exp;

        await redis.set(`blacklist:${token}`, "true", "EX", expirationTime - Math.floor(Date.now() / 1000));

        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
            return next(new ApiError(400, "Token already invalid or expired"));
        }
        next(new ApiError(500, "Logout failed"));
    }
}