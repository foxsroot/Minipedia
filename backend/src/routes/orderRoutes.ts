import express from 'express';
import { getOrderById, getAllOrders, createOrder, updateOrder, deleteOrder } from '../controllers/orderController';
import { authenticateToken } from '../middlewares/authMiddleware';

const orderRouter = express.Router();

orderRouter.get('/:id', authenticateToken, getOrderById);
orderRouter.get('/', authenticateToken, getAllOrders);
orderRouter.post('/', authenticateToken, createOrder);
orderRouter.put('/:id', authenticateToken, updateOrder);
orderRouter.delete('/:id', authenticateToken, deleteOrder);

export default orderRouter;
