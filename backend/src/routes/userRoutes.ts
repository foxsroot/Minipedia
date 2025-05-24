import express from 'express';
import { getCurrentUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.get('/me', authenticateToken, getCurrentUser);
userRouter.put('/', authenticateToken, updateUser);
userRouter.delete('/', authenticateToken, deleteUser);

export default userRouter;
