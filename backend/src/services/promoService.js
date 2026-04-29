const crypto = require('crypto');
const db = require('../config/db');

const promoAccent = ['promo-amber', 'promo-brown', 'promo-cream'];

const normalizePromo = (row, index = 0) => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  discount_amount: Number(row.discount_amount ?? 0),
  quota: Number(row.quota ?? 0),
  remaining_quota: Number(row.remaining_quota ?? 0),
  expiry_date: row.expiry_date,
  is_active: Boolean(row.is_active),
  accent: promoAccent[index % promoAccent.length],
  badge: Number(row.discount_amount ?? 0) > 0 ? `Diskon Rp${Number(row.discount_amount).toLocaleString('id-ID')}` : 'Promo',
  code: `PROMO-${String(row.id).padStart(3, '0')}`,
  is_claimed: false,
  unique_code: null,
  created_at: row.created_at,
});

const resolveUserIdByEmail = async (userEmail) => {
  if (!userEmail) {
    return null;
  }

  const [rows] = await db.query(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [userEmail]
  );

  return rows[0]?.id ?? null;
};

const listWeeklyPromos = async (userEmail = null) => {
  const [rows] = await db.query(`
    SELECT
      id,
      title,
      description,
      discount_amount,
      quota,
      remaining_quota,
      expiry_date,
      is_active,
      created_at
    FROM weekly_promos
    WHERE is_active = TRUE
    ORDER BY expiry_date ASC, id DESC
  `);

  const promos = rows.map((row, index) => normalizePromo(row, index));
  const userId = await resolveUserIdByEmail(userEmail);

  if (!userId) {
    return promos;
  }

  const [claims] = await db.query(
    `
      SELECT promo_id, unique_code, is_used
      FROM user_promo_claims
      WHERE user_id = ?
    `,
    [userId]
  );

  const claimMap = new Map(claims.map((claim) => [Number(claim.promo_id), claim]));

  return promos.map((promo) => {
    const claim = claimMap.get(Number(promo.id));

    if (!claim) {
      return promo;
    }

    return {
      ...promo,
      is_claimed: true,
      unique_code: claim.unique_code,
      is_used: Boolean(claim.is_used),
    };
  });
};

const claimPromo = async ({ promoId, userEmail = null }) => {
  const promoIdNumber = Number(promoId);

  if (!promoIdNumber) {
    const error = new Error('promoId wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const [promoRows] = await db.query(
    `
      SELECT id, title, remaining_quota, is_active
      FROM weekly_promos
      WHERE id = ?
      LIMIT 1
    `,
    [promoIdNumber]
  );

  const promo = promoRows[0];

  if (!promo || !promo.is_active) {
    const error = new Error('Promo tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  if (Number(promo.remaining_quota) <= 0) {
    const error = new Error('Kuota promo habis');
    error.statusCode = 409;
    throw error;
  }

  const userId = await resolveUserIdByEmail(userEmail);
  const uniqueCode = `WK-${promoIdNumber}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  if (!userId) {
    return {
      success: true,
      unique_code: uniqueCode,
      persisted: false,
      message: 'Kode promo sementara dibuat. Login agar klaim tersimpan di TiDB.',
    };
  }

  const [existingClaims] = await db.query(
    `
      SELECT id, unique_code
      FROM user_promo_claims
      WHERE promo_id = ? AND user_id = ?
      LIMIT 1
    `,
    [promoIdNumber, userId]
  );

  if (existingClaims.length > 0) {
    return {
      success: true,
      unique_code: existingClaims[0].unique_code,
      persisted: true,
      message: 'Promo sudah pernah diklaim',
    };
  }

  await db.query(
    `
      INSERT INTO user_promo_claims (promo_id, user_id, unique_code)
      VALUES (?, ?, ?)
    `,
    [promoIdNumber, userId, uniqueCode]
  );

  await db.query(
    `
      UPDATE weekly_promos
      SET remaining_quota = GREATEST(remaining_quota - 1, 0)
      WHERE id = ? AND remaining_quota > 0
    `,
    [promoIdNumber]
  );

  return {
    success: true,
    unique_code: uniqueCode,
    persisted: true,
  };
};

module.exports = {
  listWeeklyPromos,
  claimPromo,
};
