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

module.exports = {
  listUsers,
  registerUser,
  getUserProfile,
  updateUserProfile,
};
