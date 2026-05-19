const db = require('../config/db');

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

const normalizeText = (value) => String(value ?? '').trim();

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const tierFromPoints = (points) => {
  if (points >= 3000) return 'Platinum';
  if (points >= 1500) return 'Gold';
  if (points >= 500) return 'Silver';
  return 'Bronze';
};

const resolveMembershipStatus = (value, points = 0) => {
  const normalized = normalizeText(value);
  return normalized || tierFromPoints(points);
};

const normalizeAddressType = (value) => {
  const normalized = normalizeText(value).toLowerCase();
  if (['home', 'house', 'rumah'].includes(normalized)) return 'home';
  if (['office', 'kantor', 'work'].includes(normalized)) return 'office';
  return normalized || 'other';
};

const resolveUserId = async ({ userId, userEmail, userName }) => {
  const numericUserId = Number.parseInt(userId, 10);
  if (Number.isFinite(numericUserId) && numericUserId > 0) {
    return numericUserId;
  }

  const candidateEmail = normalizeText(userEmail);
  if (candidateEmail) {
    const [emailRows] = await withTimeout(
      db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [candidateEmail])
    );

    if (emailRows.length > 0) {
      return emailRows[0].id;
    }
  }

  const candidateName = normalizeText(userName);
  if (candidateName) {
    const [nameRows] = await withTimeout(
      db.execute('SELECT id FROM users WHERE username = ? LIMIT 1', [candidateName])
    );

    if (nameRows.length > 0) {
      return nameRows[0].id;
    }
  }

  return null;
};

const buildProfileRow = (row) => {
  if (!row) return null;

  const points = parseNumber(row.points, 0);
  const membershipStatus = resolveMembershipStatus(row.membership_status, points);

  return {
    id: row.id,
    username: normalizeText(row.username),
    name: normalizeText(row.username),
    email: normalizeText(row.email),
    role: normalizeText(row.role),
    phone: normalizeText(row.phone),
    membership_status: membershipStatus,
    membershipStatus,
    points,
    loyalty_points: points,
    total_orders: parseNumber(row.total_orders, 0),
    created_at: row.created_at || null,
  };
};

const listUsers = async () => {
  const [rows] = await withTimeout(
    db.execute(
      `
      SELECT
        id,
        username,
        email,
        role,
        points,
        phone,
        membership_status,
        created_at
      FROM users
      ORDER BY id DESC
      `
    )
  );

  return rows.map(buildProfileRow);
};

const registerUser = async ({ username, email, password, role = 'customer' }) => {
  if (!username || !email || !password) {
    const error = new Error('username, email, dan password wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const [existingRows] = await withTimeout(
    db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
  );
  if (existingRows.length > 0) {
    const error = new Error('Email sudah terdaftar');
    error.statusCode = 409;
    throw error;
  }

  const [result] = await withTimeout(
    db.execute(
      `
      INSERT INTO users (username, email, password, role, points, phone, membership_status)
      VALUES (?, ?, ?, ?, 0, NULL, ?)
      `,
      [username, email, password, role, tierFromPoints(0)]
    )
  );

  return {
    id: result.insertId,
    username,
    email,
    role,
    points: 0,
    phone: null,
    membership_status: tierFromPoints(0),
  };
};

const getUserProfile = async ({ userId, userEmail, userName } = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    return null;
  }

  const [rows] = await withTimeout(
    db.execute(
      `
      SELECT
        u.id,
        u.username,
        u.email,
        u.role,
        u.points,
        u.phone,
        u.membership_status,
        u.created_at,
        COUNT(o.id) AS total_orders
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id
      WHERE u.id = ?
      GROUP BY
        u.id,
        u.username,
        u.email,
        u.role,
        u.points,
        u.phone,
        u.membership_status,
        u.created_at
      LIMIT 1
      `,
      [resolvedUserId]
    )
  );

  return buildProfileRow(rows[0] || null);
};

const updateUserProfile = async ({
  userId,
  userEmail,
  userName,
  username,
  email,
  phone,
}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const nextUsername = normalizeText(username);
  const nextEmail = normalizeText(email);
  const hasPhone = phone !== undefined;
  const nextPhone = normalizeText(phone);

  const fields = [];
  const values = [];

  if (nextUsername) {
    fields.push('username = ?');
    values.push(nextUsername);
  }

  if (nextEmail) {
    const [existingRows] = await withTimeout(
      db.execute('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1', [nextEmail, resolvedUserId])
    );

    if (existingRows.length > 0) {
      const error = new Error('Email sudah terdaftar');
      error.statusCode = 409;
      throw error;
    }

    fields.push('email = ?');
    values.push(nextEmail);
  }

  if (hasPhone) {
    fields.push('phone = ?');
    values.push(nextPhone || null);
  }

  if (!fields.length) {
    const error = new Error('Tidak ada data profil yang diperbarui');
    error.statusCode = 400;
    throw error;
  }

  values.push(resolvedUserId);

  await withTimeout(
    db.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
  );

  return getUserProfile({ userId: resolvedUserId });
};

const buildAddressRow = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    user_id: row.user_id,
    label: normalizeText(row.label),
    type: normalizeAddressType(row.type),
    address: normalizeText(row.address),
    phone: normalizeText(row.phone),
    is_default: Number(row.is_default) === 1,
    created_at: row.created_at || null,
  };
};

const listUserAddresses = async ({ userId, userEmail, userName } = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    return [];
  }

  const [rows] = await withTimeout(
    db.execute(
      `
      SELECT
        id,
        user_id,
        label,
        type,
        address,
        phone,
        is_default,
        created_at
      FROM user_addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, created_at DESC, id DESC
      `,
      [resolvedUserId]
    )
  );

  return rows.map(buildAddressRow);
};

const addUserAddress = async ({
  userId,
  userEmail,
  userName,
  label,
  type,
  address,
  phone,
  isDefault = false,
} = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const nextLabel = normalizeText(label);
  const nextType = normalizeAddressType(type);
  const nextAddress = normalizeText(address);
  const nextPhone = normalizeText(phone);

  if (!nextLabel || !nextAddress || !nextPhone) {
    const error = new Error('label, address, dan phone wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existingRows] = await withTimeout(
      connection.execute('SELECT id FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC, id DESC', [resolvedUserId])
    );

    const shouldBeDefault = Boolean(isDefault) || existingRows.length === 0;

    if (shouldBeDefault) {
      await withTimeout(
        connection.execute('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [resolvedUserId])
      );
    }

    const [result] = await withTimeout(
      connection.execute(
        `
        INSERT INTO user_addresses (
          user_id,
          label,
          type,
          address,
          phone,
          is_default
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          resolvedUserId,
          nextLabel,
          nextType,
          nextAddress,
          nextPhone,
          shouldBeDefault ? 1 : 0,
        ]
      )
    );

    await connection.commit();

    return {
      id: result.insertId,
      user_id: resolvedUserId,
      label: nextLabel,
      type: nextType,
      address: nextAddress,
      phone: nextPhone,
      is_default: shouldBeDefault,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const setDefaultUserAddress = async ({ addressId, userId, userEmail, userName } = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const numericAddressId = Number.parseInt(addressId, 10);
  if (!Number.isFinite(numericAddressId) || numericAddressId <= 0) {
    const error = new Error('addressId wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [addressRows] = await withTimeout(
      connection.execute(
        'SELECT id FROM user_addresses WHERE id = ? AND user_id = ? LIMIT 1',
        [numericAddressId, resolvedUserId]
      )
    );

    if (addressRows.length === 0) {
      const error = new Error('Alamat tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    await withTimeout(
      connection.execute('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [resolvedUserId])
    );

    await withTimeout(
      connection.execute(
        'UPDATE user_addresses SET is_default = 1 WHERE id = ? AND user_id = ?',
        [numericAddressId, resolvedUserId]
      )
    );

    await connection.commit();

    return {
      id: numericAddressId,
      user_id: resolvedUserId,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const deleteUserAddress = async ({ addressId, userId, userEmail, userName } = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const numericAddressId = Number.parseInt(addressId, 10);
  if (!Number.isFinite(numericAddressId) || numericAddressId <= 0) {
    const error = new Error('addressId wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [addressRows] = await withTimeout(
      connection.execute(
        'SELECT id, user_id, is_default FROM user_addresses WHERE id = ? LIMIT 1',
        [numericAddressId]
      )
    );

    const existing = addressRows[0] || null;
    if (!existing) {
      const error = new Error('Alamat tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    if (resolvedUserId && Number(existing.user_id) !== Number(resolvedUserId)) {
      const error = new Error('Alamat bukan milik user ini');
      error.statusCode = 403;
      throw error;
    }

    await withTimeout(
      connection.execute('DELETE FROM user_addresses WHERE id = ?', [numericAddressId])
    );

    if (Number(existing.is_default) === 1) {
      const [remainingRows] = await withTimeout(
        connection.execute(
          `
          SELECT id
          FROM user_addresses
          WHERE user_id = ?
          ORDER BY created_at DESC, id DESC
          LIMIT 1
          `,
          [existing.user_id]
        )
      );

      if (remainingRows.length > 0) {
        await withTimeout(
          connection.execute(
            'UPDATE user_addresses SET is_default = 1 WHERE id = ? AND user_id = ?',
            [remainingRows[0].id, existing.user_id]
          )
        );
      }
    }

    await connection.commit();

    return {
      id: numericAddressId,
      user_id: existing.user_id,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const buildFavoriteRow = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    user_id: row.user_id,
    product_id: row.product_id,
    created_at: row.created_at || null,
  };
};

const listUserFavorites = async ({ userId, userEmail, userName } = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    return [];
  }

  const [rows] = await withTimeout(
    db.execute(
      `
      SELECT
        id,
        user_id,
        product_id,
        created_at
      FROM favorites
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
      `,
      [resolvedUserId]
    )
  );

  return rows.map(buildFavoriteRow);
};

const addUserFavorite = async ({ userId, userEmail, userName, productId } = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const numericProductId = Number.parseInt(productId, 10);
  if (!Number.isFinite(numericProductId) || numericProductId <= 0) {
    const error = new Error('productId wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existingRows] = await withTimeout(
      connection.execute(
        'SELECT id FROM favorites WHERE user_id = ? AND product_id = ? LIMIT 1',
        [resolvedUserId, numericProductId]
      )
    );

    if (existingRows.length > 0) {
      await connection.commit();
      return {
        id: existingRows[0].id,
        user_id: resolvedUserId,
        product_id: numericProductId,
        created_at: null,
        is_favorite: true,
      };
    }

    const [result] = await withTimeout(
      connection.execute(
        `
        INSERT INTO favorites (user_id, product_id)
        VALUES (?, ?)
        `,
        [resolvedUserId, numericProductId]
      )
    );

    await connection.commit();

    return {
      id: result.insertId,
      user_id: resolvedUserId,
      product_id: numericProductId,
      created_at: new Date().toISOString(),
      is_favorite: true,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const removeUserFavorite = async ({ userId, userEmail, userName, productId } = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const numericProductId = Number.parseInt(productId, 10);
  if (!Number.isFinite(numericProductId) || numericProductId <= 0) {
    const error = new Error('productId wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const [result] = await withTimeout(
    db.execute('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [
      resolvedUserId,
      numericProductId,
    ])
  );

  return {
    user_id: resolvedUserId,
    product_id: numericProductId,
    deleted: result.affectedRows > 0,
  };
};

module.exports = {
  listUsers,
  registerUser,
  getUserProfile,
  updateUserProfile,
  listUserAddresses,
  addUserAddress,
  setDefaultUserAddress,
  deleteUserAddress,
  listUserFavorites,
  addUserFavorite,
  removeUserFavorite,
};
