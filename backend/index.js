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
const cartRoutes = require('./src/routes/cartRoutes');
const groupCartRoutes = require('./src/routes/groupCartRoutes');
const groupSessionRoutes = require('./src/routes/groupSessionRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const baristaReportRoutes = require('./src/routes/baristaReportRoutes');
const ensureProductImageColumn = require('./src/migrations/ensureProductImageColumn');
const ensureUserProfileColumns = require('./src/migrations/ensureUserProfileColumns');
const ensureOrderTypeColumn = require('./src/migrations/ensureOrderTypeColumn');

// Import database pool
require('./src/config/db');
ensureProductImageColumn();
ensureUserProfileColumns();
ensureOrderTypeColumn();

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
app.use('/api/cart', cartRoutes);
app.use('/api/group-cart', groupCartRoutes);
app.use('/api/group-sessions', groupSessionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/barista', baristaReportRoutes);

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
