const {
  addGroupCartItem,
  ensureActiveSessionForUser,
  lockGroupSession,
  syncLocalCartToGroup,
  updateGroupMembers,
} = require('../services/groupService');

const getIdentity = (req) => ({
  userId: req.query.userId || req.body.userId,
  userEmail: req.query.userEmail || req.query.email || req.body.userEmail || req.body.email,
  userName: req.query.userName || req.query.username || req.body.userName || req.body.username,
});

const getActiveSession = async (req, res) => {
  try {
    const session = await ensureActiveSessionForUser(getIdentity(req));

    res.json(session);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal memuat sesi grup aktif',
      error: error.message,
    });
  }
};

const updateMembers = async (req, res) => {
  try {
    const session = await updateGroupMembers({
      ...getIdentity(req),
      groupCode: req.body.group_code || req.body.groupCode,
      members: req.body.members,
    });

    res.json(session);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal memperbarui anggota grup',
      error: error.message,
    });
  }
};

const lockSession = async (req, res) => {
  try {
    const session = await lockGroupSession({
      ...getIdentity(req),
      groupCode: req.body.group_code || req.body.groupCode,
    });

    res.json(session);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal mengunci sesi grup',
      error: error.message,
    });
  }
};

const addCartItem = async (req, res) => {
  try {
    const result = await addGroupCartItem({
      ...getIdentity(req),
      groupCode: req.body.group_code || req.body.groupCode,
      productId: req.body.product_id || req.body.productId,
      quantity: req.body.quantity,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal menambahkan item ke keranjang grup',
      error: error.message,
    });
  }
};

const syncLocalCart = async (req, res) => {
  try {
    const result = await syncLocalCartToGroup({
      ...getIdentity(req),
      groupCode: req.body.group_code || req.body.groupCode,
      items: req.body.items,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal menyinkronkan keranjang grup',
      error: error.message,
    });
  }
};

module.exports = {
  addCartItem,
  getActiveSession,
  lockSession,
  syncLocalCart,
  updateMembers,
};
