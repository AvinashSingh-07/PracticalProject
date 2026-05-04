const express = require('express');
const { placeOrder, getUserOrders, recalculateOrderTotal } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, placeOrder)
  .get(protect, getUserOrders);

router.get('/:id/total', protect, recalculateOrderTotal);

module.exports = router;
