const {
  listUsers,
  getUserProfile,
  updateUserProfile,
} = require('../services/userService');

const getUsers = async (req, res) => {
  try {
    const rows = await listUsers();
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const profile = await getUserProfile({
      userId: req.query.userId || req.body?.userId,
      userEmail: req.query.email || req.body?.email,
      userName: req.query.userName || req.body?.userName,
    });

    if (!profile) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateCurrentUserProfile = async (req, res) => {
  try {
    const profile = await updateUserProfile({
      userId: req.body?.userId || req.query?.userId,
      userEmail: req.body?.email || req.query?.email,
      userName: req.body?.userName || req.query?.userName,
      username: req.body?.username || req.body?.name,
      email: req.body?.email,
      phone: req.body?.phone,
    });

    if (!profile) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    return res.json({
      message: 'Profil berhasil diperbarui',
      user: profile,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
