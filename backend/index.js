const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Gunakan Routes
// Gunakan prefix /api agar sinkron dengan vercel.json
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Endpoint status
app.get('/api', (req, res) => {
    res.json({ message: "API Warung Kopi Aktif", status: "Serverless" });
});

// 4. BAGIAN YANG DIGANTI/DITAMBAH UNTUK VERCEL
// Listen hanya dijalankan jika di lingkungan lokal, bukan di Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
}

// WAJIB: Export app agar Vercel bisa mengenali fungsi serverless ini
module.exports = app;