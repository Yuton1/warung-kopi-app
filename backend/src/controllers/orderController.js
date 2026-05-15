const { listOrders, createCheckoutOrder } = require('../services/orderService');

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

const checkoutOrder = async (req, res) => {
  try {
    const result = await createCheckoutOrder({
      userId: req.body.userId || req.query.userId,
      userEmail: req.body.userEmail || req.body.email || req.query.userEmail || req.query.email,
      userName: req.body.userName || req.body.username || req.query.userName || req.query.username,
      orderType: req.body.orderType,
      paymentMethod: req.body.paymentMethod,
      promoCode: req.body.promoCode,
      tableNumber: req.body.tableNumber,
      pickupTime: req.body.pickupTime,
      pickupNote: req.body.pickupNote,
      isPreorder: req.body.isPreorder,
      splitBills: req.body.splitBills,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal membuat pesanan',
      error: error.message,
    });
  }
};

module.exports = {
  getOrders,
  checkoutOrder,
};
