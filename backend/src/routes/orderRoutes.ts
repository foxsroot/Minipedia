import express from 'express';
import { getOrderById, getAllOrders, createOrder, deleteOrder, updateOrderStatus, getTokoAllOrder } from '../controllers/orderController';
import { authenticateToken } from '../middlewares/authMiddleware';

const orderRouter = express.Router();

orderRouter.get('/:id', authenticateToken, getOrderById);
orderRouter.get('/', authenticateToken, getAllOrders);
orderRouter.post('/', authenticateToken, createOrder);
orderRouter.delete('/:id', authenticateToken, deleteOrder);
orderRouter.put('/:orderId/update-status', authenticateToken, updateOrderStatus);
orderRouter.get('/toko-owner/me', authenticateToken, getTokoAllOrder);

export default orderRouter;
