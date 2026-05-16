const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
  toggleProductAvailability,
} = require('../controllers/productController');

// Alamatnya akan menjadi: /api/products
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', addProduct);
router.put('/:id', editProduct);
router.patch('/:id/availability', toggleProductAvailability);
router.delete('/:id', deleteProduct);

module.exports = router;
