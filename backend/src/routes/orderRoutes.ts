import express from 'express';
import { getOrderById, getAllOrders, createOrder, updateOrder, deleteOrder, updateOrderStatus } from '../controllers/orderController';
import { authenticateToken } from '../middlewares/authMiddleware';

const orderRouter = express.Router();

orderRouter.get('/:id', authenticateToken, getOrderById);
orderRouter.get('/', authenticateToken, getAllOrders);
orderRouter.post('/', authenticateToken, createOrder);
orderRouter.put('/:id', authenticateToken, updateOrder);
orderRouter.delete('/:id', authenticateToken, deleteOrder);
orderRouter.put('/:orderId/update-status', authenticateToken, updateOrderStatus);

export default orderRouter;
