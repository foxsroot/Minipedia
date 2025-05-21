import express from 'express';
import { getLaporanById, getAllLaporans, createLaporan, updateLaporan, deleteLaporan } from '../controllers/laporanController';
import { authenticateToken } from '../middlewares/authMiddleware';

const laporanRouter = express.Router();

laporanRouter.get('/:id', authenticateToken, getLaporanById);
laporanRouter.get('/', authenticateToken, getAllLaporans);
laporanRouter.post('/', authenticateToken, createLaporan);
laporanRouter.put('/:id', authenticateToken, updateLaporan);
laporanRouter.delete('/:id', authenticateToken, deleteLaporan);

export default laporanRouter;
