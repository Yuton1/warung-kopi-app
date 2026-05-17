const db = require('../config/db');

const ensureUserProfileColumns = async () => {
  try {
    const [rows] = await db.execute(
      `
      SELECT COLUMN_NAME, COLUMN_TYPE
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME IN ('phone', 'membership_status')
      `
    );

    const existing = new Map(
      rows.map((row) => [String(row.COLUMN_NAME || '').toLowerCase(), String(row.COLUMN_TYPE || '').toLowerCase()])
    );

    if (!existing.has('phone')) {
      await db.execute('ALTER TABLE users ADD COLUMN phone VARCHAR(30) NULL AFTER email');
      console.log('[migrate] users.phone added');
    }

    if (!existing.has('membership_status')) {
      await db.execute('ALTER TABLE users ADD COLUMN membership_status VARCHAR(32) NULL AFTER role');
      console.log('[migrate] users.membership_status added');
    }

    await db.execute(`
      UPDATE users
      SET membership_status = CASE
        WHEN points >= 3000 THEN 'Platinum'
        WHEN points >= 1500 THEN 'Gold'
        WHEN points >= 500 THEN 'Silver'
        ELSE 'Bronze'
      END
      WHERE membership_status IS NULL OR membership_status = ''
    `);
  } catch (error) {
    console.warn('[migrate] unable to ensure users profile columns:', error.message);
  }
};

module.exports = ensureUserProfileColumns;
