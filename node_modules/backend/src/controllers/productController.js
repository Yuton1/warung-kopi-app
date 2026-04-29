const { listProducts } = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        const rows = await listProducts();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getProducts };
