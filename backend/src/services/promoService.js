const crypto = require('crypto');
const db = require('../config/db');

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

let promoQuotaColumnPromise = null;

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

const resolvePromoQuotaColumn = async () => {
  if (!promoQuotaColumnPromise) {
    promoQuotaColumnPromise = withTimeout(
      db.query(
        `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'weekly_promos'
          AND COLUMN_NAME IN ('remaining_quota', 'remaning_quota')
        ORDER BY FIELD(COLUMN_NAME, 'remaining_quota', 'remaning_quota')
        LIMIT 1
        `
      )
    )
      .then(([rows]) => rows?.[0]?.COLUMN_NAME || 'remaining_quota')
      .catch((error) => {
        promoQuotaColumnPromise = null;
        throw error;
      });
  }

  return promoQuotaColumnPromise;
};

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeAdminPromoRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  discount_amount: parseNumber(row.discount_amount, 0),
  quota: parseNumber(row.quota, 0),
  remaining_quota: parseNumber(row.remaining_quota ?? row.remaning_quota, 0),
  expiry_date: row.expiry_date || null,
  is_active: Boolean(row.is_active),
  created_at: row.created_at || null,
});

const listWeeklyPromos = async (userEmail = null) => {
  const quotaColumn = await resolvePromoQuotaColumn();
  const [rows] = await db.query(`
    SELECT
      id,
      title,
      description,
      discount_amount,
      quota,
      ${quotaColumn} AS remaining_quota,
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
  const quotaColumn = await resolvePromoQuotaColumn();
  const promoIdNumber = Number(promoId);

  if (!promoIdNumber) {
    const error = new Error('promoId wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const [promoRows] = await db.query(
    `
      SELECT id, title, ${quotaColumn} AS remaining_quota, is_active
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
      SET ${quotaColumn} = GREATEST(${quotaColumn} - 1, 0)
      WHERE id = ? AND ${quotaColumn} > 0
    `,
    [promoIdNumber]
  );

  return {
    success: true,
    unique_code: uniqueCode,
    persisted: true,
  };
};

const listAdminPromos = async () => {
  const quotaColumn = await resolvePromoQuotaColumn();
  const [rows] = await withTimeout(
    db.execute(
      `
      SELECT
        id,
        title,
        description,
        discount_amount,
        quota,
        ${quotaColumn} AS remaining_quota,
        expiry_date,
        is_active,
        created_at
      FROM weekly_promos
      ORDER BY created_at DESC, id DESC
      `
    )
  );

  return rows.map(normalizeAdminPromoRow);
};

const createAdminPromo = async ({
  title,
  description = '',
  discount_amount,
  quota,
  remaining_quota,
  expiry_date,
  is_active = 1,
} = {}) => {
  const quotaColumn = await resolvePromoQuotaColumn();
  const nextTitle = String(title ?? '').trim();
  const nextDescription = String(description ?? '').trim();
  const nextDiscount = parseNumber(discount_amount, 0);
  const nextQuota = parseNumber(quota, 0);
  const nextRemainingQuota = remaining_quota !== undefined ? parseNumber(remaining_quota, nextQuota) : nextQuota;
  const nextExpiryDate = String(expiry_date ?? '').trim();
  const nextIsActive = Number(is_active) ? 1 : 0;

  if (!nextTitle) {
    const error = new Error('title wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  if (!nextQuota || nextQuota < 0) {
    const error = new Error('quota wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  if (!nextExpiryDate) {
    const error = new Error('expiry_date wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const [result] = await withTimeout(
    db.execute(
      `
      INSERT INTO weekly_promos (
        title,
        description,
        discount_amount,
        quota,
        ${quotaColumn},
        expiry_date,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nextTitle,
        nextDescription,
        nextDiscount,
        nextQuota,
        Math.min(nextRemainingQuota, nextQuota),
        nextExpiryDate,
        nextIsActive,
      ]
    )
  );

  return {
    id: result.insertId,
    title: nextTitle,
    description: nextDescription,
    discount_amount: nextDiscount,
    quota: nextQuota,
    remaining_quota: Math.min(nextRemainingQuota, nextQuota),
    expiry_date: nextExpiryDate,
    is_active: Boolean(nextIsActive),
    created_at: new Date().toISOString(),
  };
};

const updateAdminPromo = async (promoId, payload = {}) => {
  const quotaColumn = await resolvePromoQuotaColumn();
  const numericId = Number.parseInt(promoId, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    const error = new Error('promoId wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const fields = [];
  const values = [];

  if (payload.title !== undefined) {
    const nextTitle = String(payload.title ?? '').trim();
    if (!nextTitle) {
      const error = new Error('title wajib diisi');
      error.statusCode = 400;
      throw error;
    }
    fields.push('title = ?');
    values.push(nextTitle);
  }

  if (payload.description !== undefined) {
    fields.push('description = ?');
    values.push(String(payload.description ?? '').trim());
  }

  if (payload.discount_amount !== undefined) {
    fields.push('discount_amount = ?');
    values.push(parseNumber(payload.discount_amount, 0));
  }

  if (payload.quota !== undefined) {
    fields.push('quota = ?');
    values.push(parseNumber(payload.quota, 0));
  }

  if (payload.remaining_quota !== undefined) {
    fields.push(`${quotaColumn} = ?`);
    values.push(parseNumber(payload.remaining_quota, 0));
  }

  if (payload.expiry_date !== undefined) {
    fields.push('expiry_date = ?');
    values.push(String(payload.expiry_date ?? '').trim());
  }

  if (payload.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(Number(payload.is_active) ? 1 : 0);
  }

  if (!fields.length) {
    const error = new Error('Tidak ada data untuk diperbarui');
    error.statusCode = 400;
    throw error;
  }

  values.push(numericId);

  await withTimeout(
    db.execute(
      `UPDATE weekly_promos SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
  );

  const [rows] = await withTimeout(
    db.execute(
      `
      SELECT
        id,
        title,
        description,
        discount_amount,
        quota,
        ${quotaColumn} AS remaining_quota,
        expiry_date,
        is_active,
        created_at
      FROM weekly_promos
      WHERE id = ?
      LIMIT 1
      `,
      [numericId]
    )
  );

  return normalizeAdminPromoRow(rows[0] || { id: numericId });
};

const deleteAdminPromo = async (promoId) => {
  const numericId = Number.parseInt(promoId, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    const error = new Error('promoId wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const [result] = await withTimeout(
    db.execute('DELETE FROM weekly_promos WHERE id = ?', [numericId])
  );

  return {
    id: numericId,
    deleted: result.affectedRows > 0,
  };
};

module.exports = {
  listWeeklyPromos,
  claimPromo,
  listAdminPromos,
  createAdminPromo,
  updateAdminPromo,
  deleteAdminPromo,
};
