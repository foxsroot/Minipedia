import express from 'express';
import { getCurrentUser, updateUser, deleteUser, changePassword } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.get('/me', authenticateToken, getCurrentUser);
userRouter.put('/', authenticateToken, updateUser);
userRouter.delete('/', authenticateToken, deleteUser);
userRouter.put('/change-password', authenticateToken, changePassword);

export default userRouter;
