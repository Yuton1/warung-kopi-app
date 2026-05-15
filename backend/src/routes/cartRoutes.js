const express = require('express')
const {
  getCartHandler,
  addCartItemHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler,
} = require('../controllers/cartController')

const router = express.Router()

router.get('/', getCartHandler)
router.post('/items', addCartItemHandler)
router.patch('/items/:itemId', updateCartItemHandler)
router.delete('/items/:itemId', removeCartItemHandler)
router.delete('/', clearCartHandler)

module.exports = router
