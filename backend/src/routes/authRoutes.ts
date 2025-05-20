import express from "express";
import { login, logout, register, test } from "../controllers/authenticationController";
import { authenticateToken } from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);
authRouter.get("/test", authenticateToken, test);

export default authRouter;