const express = require('express');
const router = express.Router();
const {
  addCartItem,
  syncLocalCart,
} = require('../controllers/groupController');

router.post('/items', addCartItem);
router.post('/sync-local', syncLocalCart);

module.exports = router;
