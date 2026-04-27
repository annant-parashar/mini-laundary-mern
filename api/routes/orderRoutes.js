const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getDashboard,
} = require('../controllers/orderController');

router.get('/dashboard', getDashboard);
router.post('/orders', createOrder);
router.get('/orders', getOrders);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;
