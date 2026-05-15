const express = require('express');
const router = express.Router();
const { getOrders, checkoutOrder } = require('../controllers/orderController');

router.get('/', getOrders);
router.post('/checkout', checkoutOrder);

module.exports = router;
