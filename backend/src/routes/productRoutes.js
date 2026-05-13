const express = require('express');
const router = express.Router();
const { getProducts, getProduct, addProduct, editProduct, deleteProduct } = require('../controllers/productController');

// Alamatnya akan menjadi: /api/products
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', addProduct);
router.put('/:id', editProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
