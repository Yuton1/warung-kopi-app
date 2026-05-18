const {
  listUsers,
  getUserProfile,
  updateUserProfile,
  listUserAddresses,
  addUserAddress,
  setDefaultUserAddress,
  deleteUserAddress,
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

const getUserAddresses = async (req, res) => {
  try {
    const addresses = await listUserAddresses({
      userId: req.query.userId || req.body?.userId,
      userEmail: req.query.email || req.body?.email,
      userName: req.query.userName || req.body?.userName,
    });

    return res.json(addresses);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const createUserAddress = async (req, res) => {
  try {
    const address = await addUserAddress({
      userId: req.body?.userId || req.query?.userId,
      userEmail: req.body?.email || req.query?.email,
      userName: req.body?.userName || req.query?.userName,
      label: req.body?.label,
      type: req.body?.type,
      address: req.body?.address,
      phone: req.body?.phone,
      isDefault: req.body?.is_default ?? req.body?.isDefault,
    });

    return res.status(201).json({
      message: 'Alamat berhasil disimpan',
      address,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updateDefaultUserAddress = async (req, res) => {
  try {
    const result = await setDefaultUserAddress({
      addressId: req.params.addressId,
      userId: req.body?.userId || req.query?.userId,
      userEmail: req.body?.email || req.query?.email,
      userName: req.body?.userName || req.query?.userName,
    });

    return res.json({
      message: 'Alamat default berhasil diperbarui',
      address: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const removeUserAddress = async (req, res) => {
  try {
    const result = await deleteUserAddress({
      addressId: req.params.addressId,
      userId: req.body?.userId || req.query?.userId,
      userEmail: req.body?.email || req.query?.email,
      userName: req.body?.userName || req.query?.userName,
    });

    return res.json({
      message: 'Alamat berhasil dihapus',
      address: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getUserAddresses,
  createUserAddress,
  updateDefaultUserAddress,
  removeUserAddress,
};
