import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

const redis = new Redis();

export async function login(req: Request, res: Response, next: NextFunction) {
    const JWT_SECRET = process.env.JWT_TOKEN_SECRET;

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    const payload = {
        userId: "c83d21f0-3717-4149-90e8-a4b277ba9b21",
        username: "Joel",
        email: "Joel@joeljoel.net"
    };

    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || "604800", 10);

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn
    });

    res.status(200).json({
        message: "Login successful",
        token,
    });
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