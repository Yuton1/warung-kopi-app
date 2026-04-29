const db = require('../config/db');

const normalizeProduct = (row) => ({
  ...row,
  points: Number(row.base_points ?? row.points ?? 0),
  stock: Number(row.stock ?? 0),
  is_available: Boolean(row.is_available),
  image_url: row.image_url || '',
});

const listProducts = async () => {
  const [rows] = await db.query(`
    SELECT
      id,
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
      created_at
    FROM products
    ORDER BY created_at DESC, id DESC
  `);

  return rows.map(normalizeProduct);
};

module.exports = {
  listProducts,
};
