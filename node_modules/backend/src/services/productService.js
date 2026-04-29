const db = require('../config/db');

const listProducts = async () => {
    const [rows] = await db.execute('SELECT * FROM products ORDER BY id DESC');
    return rows;
};

const createProduct = async (data) => {
    const { name, initials, description, price, base_points, category, badge, image_url, stock } = data;
    const query = `
        INSERT INTO products 
        (name, initials, description, price, base_points, category, badge, image_url, stock) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
        name, initials, description, price, base_points, category, badge, image_url, stock
    ]);
    return { id: result.insertId, ...data };
};

const removeProduct = async (id) => {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return true;
};

module.exports = { listProducts, createProduct, removeProduct };