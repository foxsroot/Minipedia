import express from 'express';
import { getTokoById, getAllTokos, createToko, updateToko, deleteToko } from '../controllers/tokoController';
import { authenticateToken } from '../middlewares/authMiddleware';

const tokoRouter = express.Router();

tokoRouter.get('/:id', authenticateToken, getTokoById);
tokoRouter.get('/', authenticateToken, getAllTokos);
tokoRouter.post('/', authenticateToken, createToko);
tokoRouter.put('/:id', authenticateToken, updateToko);
tokoRouter.delete('/:id', authenticateToken, deleteToko);

export default tokoRouter;
