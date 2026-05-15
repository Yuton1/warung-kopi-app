const {
  getCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} = require('../services/cartService')

const getIdentity = (req) => ({
  userId: req.query.userId || req.body.userId,
  userEmail: req.query.userEmail || req.query.email || req.body.userEmail || req.body.email,
  userName: req.query.userName || req.query.username || req.body.userName || req.body.username,
})

const getCartHandler = async (req, res) => {
  try {
    const cart = await getCart(getIdentity(req))
    res.json(cart)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal memuat keranjang',
      error: error.message,
    })
  }
}

const addCartItemHandler = async (req, res) => {
  try {
    const cart = await addCartItem({
      ...getIdentity(req),
      productId: req.body.productId,
      quantity: req.body.quantity,
    })

    res.status(201).json(cart)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal menambahkan menu ke keranjang',
      error: error.message,
    })
  }
}

const updateCartItemHandler = async (req, res) => {
  try {
    const cart = await updateCartItemQuantity({
      ...getIdentity(req),
      itemId: req.params.itemId,
      quantity: req.body.quantity,
    })

    res.json(cart)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal memperbarui keranjang',
      error: error.message,
    })
  }
}

const removeCartItemHandler = async (req, res) => {
  try {
    const cart = await removeCartItem({
      ...getIdentity(req),
      itemId: req.params.itemId,
    })

    res.json(cart)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal menghapus item keranjang',
      error: error.message,
    })
  }
}

const clearCartHandler = async (req, res) => {
  try {
    const cart = await clearCart(getIdentity(req))
    res.json(cart)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal mengosongkan keranjang',
      error: error.message,
    })
  }
}

module.exports = {
  getCartHandler,
  addCartItemHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler,
}
