// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
// Pastikan path ke db.js benar sesuai image_6f55f0.png
const db = require('../config/db'); 
const { registerUser } = require('../services/userService');

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Ambil data user beserta role-nya
    const [rows] = await withTimeout(
      db.query(
        'SELECT id, username, email, password, role, points, phone, membership_status FROM users WHERE email = ?',
        [email]
      )
    );
    
    if (rows.length === 0) return res.status(401).json({ message: "User tidak ditemukan" });

    const user = rows[0];

    // Cek password (Gunakan bcrypt jika di-hash, jika plain text bandingkan langsung)
    if (user.password !== password) return res.status(401).json({ message: "Password salah" });

    res.json({
      message: "Login Berhasil",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        points: user.points,
        phone: user.phone,
        membership_status: user.membership_status, // Ini yang akan dibaca LoginPage.jsx
      },
      token: "dummy-token-ahsan" // Sesuaikan dengan JWT jika kamu pakai
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body || {});
    res.status(201).json({
      message: 'Registrasi berhasil',
      user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

module.exports = router;
