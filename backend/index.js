const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import Routes
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const promoRoutes = require('./src/routes/promoRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const ensureProductImageColumn = require('./src/migrations/ensureProductImageColumn');

// Import database pool
require('./src/config/db');
ensureProductImageColumn();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

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
