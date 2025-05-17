import express from "express";
import { login, logout, test } from "../controllers/authenticationController";
import { authenticateToken } from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/test", authenticateToken, test);

export default authRouter;