const { listOrders } = require('../services/orderService');

const getOrders = async (req, res) => {
  try {
    const orders = await listOrders({
      userId: req.query.userId,
      userEmail: req.query.userEmail || req.query.email,
      userName: req.query.userName || req.query.username,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memuat pesanan',
      error: error.message,
    });
  }
};

module.exports = {
  getOrders,
};
