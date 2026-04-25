const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');

// Alamatnya akan menjadi: /api/products
router.get('/', getProducts);

module.exports = router;