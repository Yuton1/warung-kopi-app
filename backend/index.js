const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes terlebih dahulu
const productRoutes = require('./src/routes/productRoutes');

const app = express();

// 2. Middleware harus dipasang SEBELUM Routes
app.use(cors());
app.use(express.json());

// 3. Gunakan Routes yang sudah di-import
app.use('/api/products', productRoutes);

// Endpoint sederhana untuk cek status API
app.get('/', (req, res) => {
    res.json({ message: "API Warung Kopi Aktif", database: "TiDB Connected" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});