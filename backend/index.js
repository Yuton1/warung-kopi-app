const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Pastikan sudah install: npm install mysql2
require('dotenv').config();

// 1. Import Routes
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// --- TAMBAHAN: KONFIGURASI DATABASE TIDB ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        // TiDB Cloud mewajibkan SSL
        rejectUnauthorized: true,
        // Ambil sertifikat dari Environment Variable yang sudah kamu buat di Vercel
        ca: process.env.DB_CA 
    }
});

db.connect((err) => {
    if (err) {
        console.error('❌ Gagal koneksi ke TiDB:', err.message);
    } else {
        console.log('✅ Terhubung ke TiDB Cloud!');
    }
});
// -------------------------------------------

// 3. Gunakan Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/api', (req, res) => {
    res.json({ message: "API Warung Kopi Aktif", status: "Serverless" });
});

// 4. Listen Lokal
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;