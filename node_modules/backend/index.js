const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Import database pool
require('./src/config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/api', (req, res) => {
    res.json({
        message: "API Warung Kopi Aktif"
    });
});

// Listen lokal
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(
            `🚀 Server berjalan di http://localhost:${PORT}`
        );
    });
}

module.exports = app;