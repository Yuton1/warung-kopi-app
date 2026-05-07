const db = require('../config/db');

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

const listUsers = async () => {
  const [rows] = await withTimeout(
    db.execute('SELECT id, username, email, role, points, created_at FROM users ORDER BY id DESC')
  );
  return rows;
};

const registerUser = async ({ username, email, password, role = 'customer' }) => {
  if (!username || !email || !password) {
    const error = new Error('username, email, dan password wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const [existingRows] = await withTimeout(
    db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
  );
  if (existingRows.length > 0) {
    const error = new Error('Email sudah terdaftar');
    error.statusCode = 409;
    throw error;
  }

  const [result] = await withTimeout(
    db.execute(
      'INSERT INTO users (username, email, password, role, points) VALUES (?, ?, ?, ?, 0)',
      [username, email, password, role]
    )
  );

  return {
    id: result.insertId,
    username,
    email,
    role,
    points: 0,
  };
};

module.exports = {
  listUsers,
  registerUser,
};
