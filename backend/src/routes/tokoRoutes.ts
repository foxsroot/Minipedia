import express from 'express';
import { getTokoById, getAllTokos, createToko, updateToko, deleteToko, getCurrentUserTokos } from '../controllers/tokoController';
import { authenticateToken } from '../middlewares/authMiddleware';

const tokoRouter = express.Router();

tokoRouter.get('/:id', authenticateToken, getTokoById);
tokoRouter.get('/owner', authenticateToken, getCurrentUserTokos);
tokoRouter.get('/', authenticateToken, getAllTokos);
tokoRouter.post('/', authenticateToken, createToko);
tokoRouter.put('/', authenticateToken, updateToko);
tokoRouter.delete('/:id', authenticateToken, deleteToko);

export default tokoRouter;
