const {
  listOrders,
  createCheckoutOrder,
  listBaristaOrders,
  updateOrderStatus,
} = require('../services/orderService');

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

const getBaristaQueue = async (req, res) => {
  try {
    const orders = await listBaristaOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memuat antrean barista',
      error: error.message,
    });
  }
};

const updateBaristaOrderStatus = async (req, res) => {
  try {
    const orders = await updateOrderStatus({
      orderId: req.params.id,
      status: req.body.status,
    });

    res.json(orders);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal memperbarui status pesanan',
      error: error.message,
    });
  }
};

module.exports = {
  getOrders,
  checkoutOrder,
  getBaristaQueue,
  updateBaristaOrderStatus,
};
