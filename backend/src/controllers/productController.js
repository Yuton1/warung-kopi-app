const {
    listProducts,
    getProductById,
    createProduct,
    updateProduct,
    removeProduct,
    updateProductAvailability,
} = require('../services/productService');

const withTimeout = (operation, timeoutMs = 2500) => {
    let timer;

    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });

    return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

const getProducts = async (req, res) => {
    try {
        const rows = await withTimeout(listProducts());
        res.json(rows);
    } catch (error) {
        res.json([]);
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await withTimeout(getProductById(req.params.id));

        if (!product) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const product = await withTimeout(createProduct(req.body));
        res.status(201).json(product);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const editProduct = async (req, res) => {
    try {
        const product = await withTimeout(updateProduct(req.params.id, req.body));
        res.json(product);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deleted = await withTimeout(removeProduct(req.params.id));

        if (!deleted) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }

        res.json({ message: "Produk berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const toggleProductAvailability = async (req, res) => {
    try {
        const product = await withTimeout(updateProductAvailability(req.params.id, req.body.is_available));
        res.json(product);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

module.exports = { getProducts, getProduct, addProduct, editProduct, deleteProduct, toggleProductAvailability };
