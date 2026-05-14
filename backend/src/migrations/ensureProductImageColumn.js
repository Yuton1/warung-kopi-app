const db = require('../config/db')

const ensureProductImageColumn = async () => {
  try {
    const [rows] = await db.execute(
      `
      SELECT DATA_TYPE, COLUMN_TYPE
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'products'
        AND COLUMN_NAME = 'image_url'
      LIMIT 1
      `
    )

    const columnType = String(rows[0]?.COLUMN_TYPE || '').toLowerCase()
    const isLongText = columnType.includes('longtext')

    if (!isLongText) {
      await db.execute('ALTER TABLE products MODIFY COLUMN image_url LONGTEXT NULL')
      console.log('[migrate] products.image_url upgraded to LONGTEXT')
    }
  } catch (error) {
    console.warn('[migrate] unable to ensure products.image_url column:', error.message)
  }
}

module.exports = ensureProductImageColumn
