// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
// Pastikan path ke db.js benar sesuai image_6f55f0.png
const db = require('../config/db'); 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Ambil data user beserta role-nya
    const [rows] = await db.query('SELECT id, username, email, password, role FROM users WHERE email = ?', [email]);
    
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
        role: user.role // Ini yang akan dibaca LoginPage.jsx
      },
      token: "dummy-token-ahsan" // Sesuaikan dengan JWT jika kamu pakai
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;