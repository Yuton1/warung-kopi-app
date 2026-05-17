const db = require('../config/db');

const ensureOrderTypeColumn = async () => {
  try {
    const [rows] = await db.execute(
      `
      SELECT COLUMN_TYPE
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'orders'
        AND COLUMN_NAME = 'order_type'
      LIMIT 1
      `
    );

    const columnType = String(rows[0]?.COLUMN_TYPE || '').toLowerCase();
    const isVarchar20 = columnType.includes('varchar(20)');

    if (!isVarchar20) {
      await db.execute('ALTER TABLE orders MODIFY COLUMN order_type VARCHAR(20) NULL');
      console.log('[migrate] orders.order_type widened to VARCHAR(20)');
    }
  } catch (error) {
    console.warn('[migrate] unable to ensure orders.order_type column:', error.message);
  }
};

module.exports = ensureOrderTypeColumn;
