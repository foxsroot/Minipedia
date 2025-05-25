import express from 'express';
import { getTokoById, getAllTokos, createToko, updateToko, deleteToko, getCurrentUserToko } from '../controllers/tokoController';
import { authenticateToken } from '../middlewares/authMiddleware';

const tokoRouter = express.Router();

tokoRouter.get('/:id', authenticateToken, getTokoById);
tokoRouter.get('/current/owner', authenticateToken, getCurrentUserToko);
tokoRouter.get('/', authenticateToken, getAllTokos);
tokoRouter.post('/', authenticateToken, createToko);
tokoRouter.put('/', authenticateToken, updateToko);
tokoRouter.delete('/', authenticateToken, deleteToko);

export default tokoRouter;
