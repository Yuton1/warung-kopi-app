const db = require('../config/db');

const listProducts = async () => {
    const [rows] = await db.execute('SELECT * FROM products ORDER BY id DESC');
    return rows;
};

const getProductById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
};

const createProduct = async (data) => {
    const {
        name,
        initials,
        description,
        price,
        base_points,
        category,
        badge,
        image_url,
        stock,
        is_available = 1,
    } = data;

    const normalizedPrice = Number(price) || 0;
    const normalizedBasePoints = Number.isFinite(Number(base_points))
        ? Number(base_points)
        : Math.floor(normalizedPrice / 1000);
    const normalizedStock = Number(stock) || 0;
    const normalizedAvailability = is_available ? 1 : 0;

    const query = `
        INSERT INTO products 
        (name, initials, description, price, base_points, category, badge, image_url, stock, is_available) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
        name,
        initials,
        description,
        normalizedPrice,
        normalizedBasePoints,
        category,
        badge,
        image_url || null,
        normalizedStock,
        normalizedAvailability,
    ]);
    return {
        id: result.insertId,
        name,
        initials,
        description,
        price: normalizedPrice,
        base_points: normalizedBasePoints,
        category,
        badge,
        image_url: image_url || null,
        stock: normalizedStock,
        is_available: normalizedAvailability,
    };
};

const updateProduct = async (id, data) => {
    const existing = await getProductById(id);

    if (!existing) {
        const error = new Error('Produk tidak ditemukan');
        error.statusCode = 404;
        throw error;
    }

    const {
        name,
        initials,
        description,
        price,
        base_points,
        category,
        badge,
        image_url,
        stock,
        is_available,
    } = data;

    const normalizedPrice = Number(price) || 0;
    const normalizedBasePoints = Number.isFinite(Number(base_points))
        ? Number(base_points)
        : Math.floor(normalizedPrice / 1000);
    const normalizedStock = Number(stock) || 0;
    const normalizedAvailability = is_available ? 1 : 0;

    await db.execute(
        `
        UPDATE products
        SET name = ?,
            initials = ?,
            description = ?,
            price = ?,
            base_points = ?,
            category = ?,
            badge = ?,
            image_url = ?,
            stock = ?,
            is_available = ?
        WHERE id = ?
        `,
        [
            name,
            initials,
            description,
            normalizedPrice,
            normalizedBasePoints,
            category,
            badge,
            image_url || null,
            normalizedStock,
            normalizedAvailability,
            id,
        ]
    );

    return {
        id: Number(id),
        name,
        initials,
        description,
        price: normalizedPrice,
        base_points: normalizedBasePoints,
        category,
        badge,
        image_url: image_url || null,
        stock: normalizedStock,
        is_available: normalizedAvailability,
    };
};

const removeProduct = async (id) => {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

const updateProductAvailability = async (id, isAvailable) => {
    const existing = await getProductById(id);

    if (!existing) {
        const error = new Error('Produk tidak ditemukan');
        error.statusCode = 404;
        throw error;
    }

    const normalizedAvailability = Number(isAvailable) ? 1 : 0;

    await db.execute(
        `
        UPDATE products
        SET is_available = ?
        WHERE id = ?
        `,
        [normalizedAvailability, id]
    );

    return {
        ...existing,
        is_available: normalizedAvailability,
    };
};

module.exports = { listProducts, getProductById, createProduct, updateProduct, removeProduct, updateProductAvailability };
