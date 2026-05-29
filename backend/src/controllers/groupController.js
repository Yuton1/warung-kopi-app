const {
  addGroupCartItem,
  createGroupSessionFromHost,
  ensureActiveSessionForUser,
  lockGroupSession,
  syncLocalCartToGroup,
  updateGroupMembers,
} = require('../services/groupService');

const createSession = async (req, res) => {
  try {
    const hostId = req.body.host_id ?? req.body.hostId ?? req.body.user_id ?? req.body.userId;

    if (!hostId) {
      return res.status(400).json({
        message: 'host_id wajib diisi',
      });
    }

    const session = await createGroupSessionFromHost({
      hostId,
      userId: req.body.user_id ?? req.body.userId,
      userEmail: req.body.user_email || req.body.userEmail || req.body.email,
      userName: req.body.user_name || req.body.userName || req.body.username,
    });

    return res.status(201).json({
      id: session.id,
      group_code: session.group_code,
      host_id: session.host_id,
      status: session.status,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal membuat sesi grup',
      error: error.message,
    });
  }
};

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
  createSession,
  getActiveSession,
  lockSession,
  syncLocalCart,
  updateMembers,
};
