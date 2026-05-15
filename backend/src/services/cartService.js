const crypto = require('crypto')
const db = require('../config/db')

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs)
  })

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer))
}

const FALLBACK_IMAGE = '/Logo_Warkop_Nav.png'

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeText = (value) => String(value ?? '').trim()

const resolveUserId = async ({ userId, userEmail, userName }) => {
  const numericUserId = Number.parseInt(userId, 10)
  if (Number.isFinite(numericUserId) && numericUserId > 0) {
    return numericUserId
  }

  const candidateEmail = normalizeText(userEmail)
  if (candidateEmail) {
    const [emailRows] = await withTimeout(
      db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [candidateEmail])
    )

    if (emailRows.length > 0) {
      return emailRows[0].id
    }
  }

  const candidateName = normalizeText(userName)
  if (candidateName) {
    const [nameRows] = await withTimeout(
      db.execute('SELECT id FROM users WHERE username = ? LIMIT 1', [candidateName])
    )

    if (nameRows.length > 0) {
      return nameRows[0].id
    }
  }

  return null
}

const generateGroupCode = () => `GC${crypto.randomBytes(4).toString('hex').toUpperCase()}`

const getActiveSession = async (userId) => {
  const [rows] = await withTimeout(
    db.execute(
      `
      SELECT id, group_code, host_id, status, created_at
      FROM group_sessions
      WHERE host_id = ? AND status = 'active'
      ORDER BY created_at DESC, id DESC
      LIMIT 1
      `,
      [userId]
    )
  )

  return rows[0] || null
}

const createSession = async (userId) => {
  const groupCode = generateGroupCode()
  const [result] = await withTimeout(
    db.execute(
      `
      INSERT INTO group_sessions (group_code, host_id, status)
      VALUES (?, ?, 'active')
      `,
      [groupCode, userId]
    )
  )

  return {
    id: result.insertId,
    group_code: groupCode,
    host_id: userId,
    status: 'active',
    created_at: new Date().toISOString(),
  }
}

const ensureActiveSession = async (userId) => {
  const existingSession = await getActiveSession(userId)
  if (existingSession) {
    return existingSession
  }

  return createSession(userId)
}

const getCartRows = async (sessionId, userId) => {
  const [rows] = await withTimeout(
    db.execute(
      `
      SELECT
        gci.id AS item_id,
        gci.group_session_id,
        gci.user_id,
        gci.product_id,
        gci.quantity,
        p.name AS product_name,
        p.category AS product_category,
        p.description AS product_description,
        p.price AS product_price,
        p.image_url AS product_image,
        p.badge AS product_badge,
        p.stock AS product_stock
      FROM group_cart_items gci
      LEFT JOIN products p ON p.id = gci.product_id
      WHERE gci.group_session_id = ? AND gci.user_id = ?
      ORDER BY gci.id DESC
      `,
      [sessionId, userId]
    )
  )

  return rows
}

const buildCartPayload = (session, rows) => {
  const items = rows.map((row) => {
    const quantity = parseNumber(row.quantity, 1)
    const unitPrice = parseNumber(row.product_price, 0)
    const imageUrl = normalizeText(row.product_image) || FALLBACK_IMAGE

    return {
      id: row.item_id,
      productId: row.product_id,
      groupSessionId: row.group_session_id,
      userId: row.user_id,
      name: normalizeText(row.product_name) || 'Menu',
      category: normalizeText(row.product_category) || 'Menu',
      description: normalizeText(row.product_description),
      imageUrl,
      image: imageUrl,
      badge: normalizeText(row.product_badge),
      stock: parseNumber(row.product_stock, 0),
      qty: quantity,
      price: unitPrice,
      unitPrice,
      size: {
        label: 'Normal',
        note: 'Default',
        factor: 1,
      },
      subtotal: unitPrice * quantity,
    }
  })

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)

  return {
    session: session
      ? {
          id: session.id,
          groupCode: session.group_code,
          status: session.status,
          hostId: session.host_id,
          createdAt: session.created_at || null,
        }
      : null,
    items,
    subtotal,
    totalItems,
    count: totalItems,
  }
}

const getCart = async ({ userId, userEmail, userName }) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName })

  if (!resolvedUserId) {
    return {
      session: null,
      items: [],
      subtotal: 0,
      totalItems: 0,
      count: 0,
    }
  }

  const session = await getActiveSession(resolvedUserId)

  if (!session) {
    return {
      session: null,
      items: [],
      subtotal: 0,
      totalItems: 0,
      count: 0,
    }
  }

  const rows = await getCartRows(session.id, resolvedUserId)
  return buildCartPayload(session, rows)
}

const addCartItem = async ({ userId, userEmail, userName, productId, quantity = 1 }) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName })
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan')
    error.statusCode = 404
    throw error
  }

  const productNumericId = Number.parseInt(productId, 10)
  if (!Number.isFinite(productNumericId) || productNumericId <= 0) {
    const error = new Error('productId wajib diisi')
    error.statusCode = 400
    throw error
  }

  const addQuantity = Math.max(Number.parseInt(quantity, 10) || 1, 1)

  const [productRows] = await withTimeout(
    db.execute(
      `
      SELECT id, stock, is_available
      FROM products
      WHERE id = ?
      LIMIT 1
      `,
      [productNumericId]
    )
  )

  if (productRows.length === 0) {
    const error = new Error('Produk tidak ditemukan')
    error.statusCode = 404
    throw error
  }

  const product = productRows[0]
  if (Number(product.is_available) === 0 || parseNumber(product.stock, 0) <= 0) {
    const error = new Error('Menu sedang tidak tersedia')
    error.statusCode = 400
    throw error
  }

  const session = await ensureActiveSession(resolvedUserId)

  const [existingRows] = await withTimeout(
    db.execute(
      `
      SELECT id, quantity
      FROM group_cart_items
      WHERE group_session_id = ? AND user_id = ? AND product_id = ?
      LIMIT 1
      `,
      [session.id, resolvedUserId, productNumericId]
    )
  )

  if (existingRows.length > 0) {
    const currentQuantity = parseNumber(existingRows[0].quantity, 0)
    const nextQuantity = currentQuantity + addQuantity

    if (parseNumber(product.stock, 0) > 0 && nextQuantity > parseNumber(product.stock, 0)) {
      const error = new Error('Stok menu tidak mencukupi')
      error.statusCode = 400
      throw error
    }

    await withTimeout(
      db.execute('UPDATE group_cart_items SET quantity = ? WHERE id = ?', [nextQuantity, existingRows[0].id])
    )
  } else {
    if (parseNumber(product.stock, 0) > 0 && addQuantity > parseNumber(product.stock, 0)) {
      const error = new Error('Stok menu tidak mencukupi')
      error.statusCode = 400
      throw error
    }

    await withTimeout(
      db.execute(
        `
        INSERT INTO group_cart_items (group_session_id, user_id, product_id, quantity)
        VALUES (?, ?, ?, ?)
        `,
        [session.id, resolvedUserId, productNumericId, addQuantity]
      )
    )
  }

  return getCart({ userId: resolvedUserId })
}

const updateCartItemQuantity = async ({ userId, userEmail, userName, itemId, quantity }) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName })
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan')
    error.statusCode = 404
    throw error
  }

  const cartItemId = Number.parseInt(itemId, 10)
  const nextQuantity = Number.parseInt(quantity, 10)

  if (!Number.isFinite(cartItemId) || cartItemId <= 0) {
    const error = new Error('itemId wajib diisi')
    error.statusCode = 400
    throw error
  }

  const [rows] = await withTimeout(
    db.execute(
      `
      SELECT id
      FROM group_cart_items
      WHERE id = ? AND user_id = ?
      LIMIT 1
      `,
      [cartItemId, resolvedUserId]
    )
  )

  if (rows.length === 0) {
    const error = new Error('Item keranjang tidak ditemukan')
    error.statusCode = 404
    throw error
  }

  if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
    await withTimeout(
      db.execute('DELETE FROM group_cart_items WHERE id = ? AND user_id = ?', [cartItemId, resolvedUserId])
    )
  } else {
    await withTimeout(
      db.execute('UPDATE group_cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [
        nextQuantity,
        cartItemId,
        resolvedUserId,
      ])
    )
  }

  return getCart({ userId: resolvedUserId })
}

const removeCartItem = async ({ userId, userEmail, userName, itemId }) => {
  return updateCartItemQuantity({
    userId,
    userEmail,
    userName,
    itemId,
    quantity: 0,
  })
}

const clearCart = async ({ userId, userEmail, userName }) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName })
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan')
    error.statusCode = 404
    throw error
  }

  const session = await getActiveSession(resolvedUserId)

  if (!session) {
    return {
      session: null,
      items: [],
      subtotal: 0,
      totalItems: 0,
      count: 0,
    }
  }

  await withTimeout(
    db.execute('DELETE FROM group_cart_items WHERE group_session_id = ? AND user_id = ?', [
      session.id,
      resolvedUserId,
    ])
  )

  return getCart({ userId: resolvedUserId })
}

module.exports = {
  getCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
}
