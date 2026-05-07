const { listUsers } = require('../services/userService');

const getUsers = async (req, res) => {
  try {
    const rows = await listUsers();
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers };
