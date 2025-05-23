import express from 'express';
import { getUserById, getCurrentUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.get('/:id', authenticateToken, getUserById);
userRouter.get('/me', authenticateToken, getCurrentUser);
userRouter.put('/:id', authenticateToken, updateUser);
userRouter.delete('/:id', authenticateToken, deleteUser);

export default userRouter;
