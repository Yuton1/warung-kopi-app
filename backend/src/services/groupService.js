const crypto = require('crypto');
const db = require('../config/db');

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

const FALLBACK_IMAGE = '/Logo_Warkop_Nav.png';
const GROUP_CODE_LENGTH = 8;
const GROUP_CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeText = (value) => String(value ?? '').trim();

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

const generateGroupCode = (length = GROUP_CODE_LENGTH) => {
  const bytes = crypto.randomBytes(length);
  let code = '';

  for (let index = 0; index < length; index += 1) {
    code += GROUP_CODE_CHARSET[bytes[index] % GROUP_CODE_CHARSET.length];
  }

  return code;
};

const isDuplicateKeyError = (error) =>
  error?.code === 'ER_DUP_ENTRY' ||
  error?.code === 'ER_DUP_KEY' ||
  error?.errno === 1062;

const groupCodeExists = async (connection, groupCode) => {
  const code = normalizeText(groupCode);
  if (!code) return false;

  const [rows] = await withTimeout(
    connection.execute(
      `
      SELECT id
      FROM group_sessions
      WHERE group_code = ?
      LIMIT 1
      `,
      [code]
    )
  );

  return rows.length > 0;
};

const generateUniqueGroupCode = async (connection, attempts = 20) => {
  for (let index = 0; index < attempts; index += 1) {
    const code = generateGroupCode();
    if (!(await groupCodeExists(connection, code))) {
      return code;
    }
  }

  const error = new Error('Gagal membuat kode grup unik');
  error.statusCode = 500;
  throw error;
};

const mapSession = (row) => ({
  id: row.id,
  group_code: row.group_code,
  host_id: row.host_id,
  status: row.status,
  created_at: row.created_at || null,
  members: Number.isFinite(Number(row.members)) ? Number(row.members) : 1,
});

const getGroupSessionByCode = async (connection, groupCode) => {
  const code = normalizeText(groupCode);
  if (!code) return null;

  const [rows] = await withTimeout(
    connection.execute(
      `
      SELECT id, group_code, host_id, status, created_at
      FROM group_sessions
      WHERE group_code = ?
      LIMIT 1
      `,
      [code]
    )
  );

  return rows[0] ? mapSession(rows[0]) : null;
};

const getActiveGroupSessionByUserId = async (connection, userId) => {
  const [rows] = await withTimeout(
    connection.execute(
      `
      SELECT id, group_code, host_id, status, created_at
      FROM group_sessions
      WHERE host_id = ? AND status = 'active'
      ORDER BY created_at DESC, id DESC
      LIMIT 1
      `,
      [userId]
    )
  );

  return rows[0] ? mapSession(rows[0]) : null;
};

const hasMembersColumn = async (connection) => {
  const [rows] = await withTimeout(
    connection.execute(
      `
      SELECT COUNT(*) AS total
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = 'group_sessions'
        AND column_name = 'members'
      `
    )
  );

  return Number(rows[0]?.total || 0) > 0;
};

const createGroupSession = async (connection, userId) => {
  const numericUserId = parseNumber(userId, 0);
  if (numericUserId <= 0) {
    const error = new Error('host_id wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const groupCode = await generateUniqueGroupCode(connection);

    try {
      const [result] = await withTimeout(
        connection.execute(
          `
          INSERT INTO group_sessions (group_code, host_id, status)
          VALUES (?, ?, 'active')
          `,
          [groupCode, numericUserId]
        )
      );

      return mapSession({
        id: result.insertId,
        group_code: groupCode,
        host_id: numericUserId,
        status: 'active',
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      if (!isDuplicateKeyError(error)) {
        throw error;
      }
    }
  }

  const error = new Error('Gagal membuat sesi grup baru');
  error.statusCode = 500;
  throw error;
};

const createGroupSessionFromHost = async ({ hostId, userId, userEmail, userName }) => {
  const resolvedHostId = Number.parseInt(hostId ?? userId, 10);
  const fallbackResolvedHostId = Number.isFinite(resolvedHostId) && resolvedHostId > 0
    ? resolvedHostId
    : await resolveUserId({ userId, userEmail, userName });

  if (!fallbackResolvedHostId) {
    const error = new Error('host_id wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const connection = await db.getConnection();

  try {
    return await createGroupSession(connection, fallbackResolvedHostId);
  } finally {
    connection.release();
  }
};

const ensureActiveSessionForUser = async ({ userId, userEmail, userName }) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    return null;
  }

  const connection = await db.getConnection();

  try {
    const existing = await getActiveGroupSessionByUserId(connection, resolvedUserId);
    if (existing) {
      return existing;
    }

    return await createGroupSession(connection, resolvedUserId);
  } finally {
    connection.release();
  }
};

const resolveWritableSession = async (connection, { userId, groupCode, userEmail, userName }) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const sessionByCode = await getGroupSessionByCode(connection, groupCode);
  if (sessionByCode) {
    return { resolvedUserId, session: sessionByCode };
  }

  const activeSession = await getActiveGroupSessionByUserId(connection, resolvedUserId);
  if (activeSession) {
    return { resolvedUserId, session: activeSession };
  }

  const createdSession = await createGroupSession(connection, resolvedUserId);
  return { resolvedUserId, session: createdSession };
};

const buildGroupCartPayload = async (connection, session, userId) => {
  const [rows] = await withTimeout(
    connection.execute(
      `
      SELECT
        gci.id AS item_id,
        gci.group_session_id,
        gci.user_id,
        gci.product_id,
        gci.quantity,
        p.name AS product_name,
        p.category AS product_category,
        p.image_url AS product_image,
        p.price AS product_price,
        p.badge AS product_badge,
        p.stock AS product_stock
      FROM group_cart_items gci
      LEFT JOIN products p ON p.id = gci.product_id
      WHERE gci.group_session_id = ? AND gci.user_id = ?
      ORDER BY gci.id DESC
      `,
      [session.id, userId]
    )
  );

  const items = rows.map((row) => {
    const quantity = parseNumber(row.quantity, 1);
    const unitPrice = parseNumber(row.product_price, 0);
    const imageUrl = normalizeText(row.product_image) || FALLBACK_IMAGE;

    return {
      id: row.item_id,
      productId: row.product_id,
      groupSessionId: row.group_session_id,
      userId: row.user_id,
      name: normalizeText(row.product_name) || 'Menu',
      category: normalizeText(row.product_category) || 'Menu',
      imageUrl,
      image: imageUrl,
      badge: normalizeText(row.product_badge),
      stock: parseNumber(row.product_stock, 0),
      qty: quantity,
      price: unitPrice,
      unitPrice,
      subtotal: unitPrice * quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return {
    session,
    items,
    subtotal,
    totalItems,
    count: totalItems,
  };
};

const upsertGroupCartItem = async (connection, { sessionId, userId, productId, quantity }) => {
  const numericProductId = Number.parseInt(productId, 10);
  const addQuantity = Math.max(Number.parseInt(quantity, 10) || 1, 1);

  if (!Number.isFinite(numericProductId) || numericProductId <= 0) {
    return null;
  }

  const [productRows] = await withTimeout(
    connection.execute(
      `
      SELECT id
      FROM products
      WHERE id = ?
      LIMIT 1
      `,
      [numericProductId]
    )
  );

  if (!productRows.length) {
    return null;
  }

  const [existingRows] = await withTimeout(
    connection.execute(
      `
      SELECT id, quantity
      FROM group_cart_items
      WHERE group_session_id = ? AND user_id = ? AND product_id = ?
      LIMIT 1
      `,
      [sessionId, userId, numericProductId]
    )
  );

  if (existingRows.length > 0) {
    const currentQuantity = parseNumber(existingRows[0].quantity, 0);
    const nextQuantity = currentQuantity + addQuantity;
    await withTimeout(
      connection.execute('UPDATE group_cart_items SET quantity = ? WHERE id = ?', [
        nextQuantity,
        existingRows[0].id,
      ])
    );
  } else {
    await withTimeout(
      connection.execute(
        `
        INSERT INTO group_cart_items (group_session_id, user_id, product_id, quantity)
        VALUES (?, ?, ?, ?)
        `,
        [sessionId, userId, numericProductId, addQuantity]
      )
    );
  }

  return numericProductId;
};

const addGroupCartItem = async ({ userId, userEmail, userName, groupCode, productId, quantity }) => {
  const connection = await db.getConnection();

  try {
    const { resolvedUserId, session } = await resolveWritableSession(connection, {
      userId,
      userEmail,
      userName,
      groupCode,
    });

    const updatedProductId = await upsertGroupCartItem(connection, {
      sessionId: session.id,
      userId: resolvedUserId,
      productId,
      quantity,
    });

    return {
      ...(await buildGroupCartPayload(connection, session, resolvedUserId)),
      updatedProductId,
    };
  } finally {
    connection.release();
  }
};

const syncLocalCartToGroup = async ({ userId, userEmail, userName, groupCode, items = [] }) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { resolvedUserId, session } = await resolveWritableSession(connection, {
      userId,
      userEmail,
      userName,
      groupCode,
    });

    const safeItems = Array.isArray(items) ? items : [];
    for (const item of safeItems) {
      const productId = item?.productId ?? item?.product_id ?? item?.id ?? item?.productID;
      const quantity = item?.quantity ?? item?.qty ?? 1;
      await upsertGroupCartItem(connection, {
        sessionId: session.id,
        userId: resolvedUserId,
        productId,
        quantity,
      });
    }

    await connection.commit();
    return buildGroupCartPayload(connection, session, resolvedUserId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const updateGroupMembers = async ({ userId, userEmail, userName, groupCode, members }) => {
  const connection = await db.getConnection();

  try {
    const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
    const numericMembers = Math.max(parseNumber(members, 1), 1);

    const session = groupCode
      ? await getGroupSessionByCode(connection, groupCode)
      : resolvedUserId
        ? await getActiveGroupSessionByUserId(connection, resolvedUserId)
        : null;

    if (!session) {
      const error = new Error('Sesi grup tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    if (await hasMembersColumn(connection)) {
      await withTimeout(
        connection.execute('UPDATE group_sessions SET members = ? WHERE id = ?', [
          numericMembers,
          session.id,
        ])
      );
    }

    return {
      ...session,
      members: numericMembers,
    };
  } finally {
    connection.release();
  }
};

const lockGroupSession = async ({ userId, userEmail, userName, groupCode }) => {
  const connection = await db.getConnection();

  try {
    const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
    const session = groupCode
      ? await getGroupSessionByCode(connection, groupCode)
      : resolvedUserId
        ? await getActiveGroupSessionByUserId(connection, resolvedUserId)
        : null;

    if (!session) {
      const error = new Error('Sesi grup tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    await withTimeout(
      connection.execute("UPDATE group_sessions SET status = 'checkout' WHERE id = ?", [session.id])
    );

    return {
      ...session,
      status: 'checkout',
    };
  } finally {
    connection.release();
  }
};

module.exports = {
  addGroupCartItem,
  createGroupSessionFromHost,
  ensureActiveSessionForUser,
  getActiveGroupSessionByUserId,
  getGroupSessionByCode,
  lockGroupSession,
  syncLocalCartToGroup,
  updateGroupMembers,
};
