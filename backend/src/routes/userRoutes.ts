import express from 'express';
import { getUserById, getAllUsers, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.get('/:id', authenticateToken, getUserById);
userRouter.get('/', authenticateToken, getAllUsers);
userRouter.put('/:id', authenticateToken, updateUser);
userRouter.delete('/:id', authenticateToken, deleteUser);

export default userRouter;
