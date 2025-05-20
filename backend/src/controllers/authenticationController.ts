import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { encryptField, decryptField } from "../utils/encryption";

const redis = new Redis();

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, email, password, nama, nomorTelpon, statusMember } = req.body;
        if (!username || !email || !password || !nama || !nomorTelpon || !statusMember) {
            return next(new ApiError(400, 'All fields are required'));
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return next(new ApiError(409, 'Email already registered'));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;
        if (!ENCRYPT_SECRET || ENCRYPT_SECRET.length !== 64) {
            return next(new ApiError(500, 'ENCRYPT_SECRET must be a 64-character hex string'));
        }
        const encryptedUser = {
            username: encryptField(username, ENCRYPT_SECRET),
            email: encryptField(email, ENCRYPT_SECRET),
            nama: encryptField(nama, ENCRYPT_SECRET),
            nomorTelpon: encryptField(nomorTelpon, ENCRYPT_SECRET),
            statusMember: encryptField(statusMember, ENCRYPT_SECRET),
            password: hashedPassword,
            waktuJoin: new Date(),
        };
        const user = await User.create(encryptedUser);
        res.status(201).json({ message: 'Registration successful', user });
    } catch (err) {
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
            return next(new ApiError(500, 'ENCRYPT_SECRET must be a 64-character hex string'));
        }

        const users = await User.findAll();
        let user = null;
        for (const u of users) {
            const decryptedEmail = decryptField(u.email, ENCRYPT_SECRET);
            if (decryptedEmail === email) {
                user = u;
                break;
            }
        }
        if (!user) {
            return next(new ApiError(401, 'Invalid email or password'));
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return next(new ApiError(401, 'Invalid email or password'));
        }
        const payload = {
            userId: user.userId,
            username: decryptField(user.username, ENCRYPT_SECRET),
            email: decryptField(user.email, ENCRYPT_SECRET)
        };
        const JWT_SECRET = process.env.JWT_TOKEN_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in the environment variables.');
        }
        const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '604800', 10);
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        next(err);
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

        const decoded = jwt.verify(token, JWT_SECRET) as { exp: number };
        const expirationTime = decoded.exp;

        await redis.set(`blacklist:${token}`, "true", "EX", expirationTime - Math.floor(Date.now() / 1000));

        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        next(new ApiError(500, "Logout failed"));
    }
}

export async function test(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        message: "Test success"
    })
}