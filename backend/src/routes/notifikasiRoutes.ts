import express from 'express';
import { getNotifikasiById, getAllNotifikasis, createNotifikasi, updateNotifikasi, deleteNotifikasi } from '../controllers/notifikasiController';
import { authenticateToken } from '../middlewares/authMiddleware';

const notifikasiRouter = express.Router();

notifikasiRouter.get('/:id', authenticateToken, getNotifikasiById);
notifikasiRouter.get('/', authenticateToken, getAllNotifikasis);
notifikasiRouter.post('/', authenticateToken, createNotifikasi);
notifikasiRouter.put('/:id', authenticateToken, updateNotifikasi);
notifikasiRouter.delete('/:id', authenticateToken, deleteNotifikasi);

export default notifikasiRouter;
