const { listProducts, createProduct, removeProduct } = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        const rows = await listProducts();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const product = await createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await removeProduct(req.params.id);
        res.json({ message: "Produk berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getProducts, addProduct, deleteProduct };