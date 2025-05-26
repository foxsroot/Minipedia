import express from 'express';
import { getBarangById, getAllBarangs, createBarang, updateBarang, deleteBarang } from '../controllers/barangController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { uploadSingleImage } from "../middlewares/multerMiddleware";
const barangRouter = express.Router();

barangRouter.get('/:id', authenticateToken, getBarangById);
barangRouter.get('/', authenticateToken, getAllBarangs);
barangRouter.post('/', authenticateToken, uploadSingleImage, createBarang);
barangRouter.put('/:id', authenticateToken, uploadSingleImage, updateBarang);
barangRouter.delete('/:id', authenticateToken, deleteBarang);

export default barangRouter;
