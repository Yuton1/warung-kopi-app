const express = require('express');
const router = express.Router();
const {
  getOrders,
  checkoutOrder,
  getBaristaQueue,
  updateBaristaOrderStatus,
} = require('../controllers/orderController');

router.get('/', getOrders);
router.post('/checkout', checkoutOrder);
router.get('/barista/queue', getBaristaQueue);
router.patch('/barista/:id/status', updateBaristaOrderStatus);
router.patch('/:id/status', updateBaristaOrderStatus);

module.exports = router;
