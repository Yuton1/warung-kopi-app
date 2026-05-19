const db = require('../config/db');

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

const FALLBACK_IMAGE = '/Logo_Warkop_Nav.png';
const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  COMPLETED: 'completed',
};

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeText = (value) => String(value ?? '').trim();

const normalizeStatus = (value) => normalizeText(value).toLowerCase();

const normalizeStatusCode = (value) => {
  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    if (numericValue === 0) return ORDER_STATUS.PENDING;
    if (numericValue === 1) return ORDER_STATUS.PROCESSING;
    if (numericValue === 2) return ORDER_STATUS.READY;
    if (numericValue === 3) return ORDER_STATUS.COMPLETED;
  }

  const normalized = normalizeStatus(value);

  if (normalized === 'pending' || normalized === 'new' || normalized === 'menunggu' || normalized === 'pemesanan') {
    return ORDER_STATUS.PENDING;
  }

  if (
    normalized === 'processing' ||
    normalized === 'proses' ||
    normalized === 'diproses' ||
    normalized === 'in progress'
  ) {
    return ORDER_STATUS.PROCESSING;
  }

  if (normalized === 'ready' || normalized === 'siap' || normalized === 'siap diambil' || normalized === 'siap_diambil') {
    return ORDER_STATUS.READY;
  }

  if (normalized === 'completed' || normalized === 'selesai' || normalized === 'done') {
    return ORDER_STATUS.COMPLETED;
  }

  return null;
};

const normalizeOrderType = (value) => {
  const normalized = normalizeText(value).toLowerCase().replace(/\s+/g, '-');

  if (!normalized) return 'dine-in';
  if (normalized === 'dine_in' || normalized === 'dinein') return 'dine-in';
  if (normalized === 'take-away' || normalized === 'takeaway' || normalized === 'take_away') return 'takeaway';
  if (normalized === 'pre-order' || normalized === 'pre_order' || normalized === 'preorder') return 'preorder';
  if (normalized === 'delivery' || normalized === 'antar') return 'delivery';

  return normalized.slice(0, 20);
};

const formatStatusLabel = (value) => {
  const code = normalizeStatusCode(value);
  if (code === ORDER_STATUS.PENDING) return 'Pending';
  if (code === ORDER_STATUS.PROCESSING) return 'Processing';
  if (code === ORDER_STATUS.READY) return 'Ready';
  if (code === ORDER_STATUS.COMPLETED) return 'Completed';

  const normalized = normalizeStatus(value);

  if (!normalized) return 'Proses';
  if (normalized === 'siap diambil' || normalized === 'siap_diambil') return 'Siap Diambil';
  if (normalized === 'dibatalkan' || normalized === 'cancelled') return 'Dibatalkan';
  if (normalized === 'selesai' || normalized === 'done' || normalized === 'completed') return 'Selesai';
  if (normalized === 'pemesanan' || normalized === 'menunggu' || normalized === 'pending') return 'Pemesanan';
  if (normalized === 'pembayaran' || normalized === 'paid' || normalized === 'dibayar') return 'Pembayaran';
  if (normalized === 'proses' || normalized === 'diproses') return 'Proses';
  return normalized
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const statusToStep = (value) => {
  const code = normalizeStatusCode(value);
  if (code === ORDER_STATUS.PENDING) return 0;
  if (code === ORDER_STATUS.PROCESSING) return 1;
  if (code === ORDER_STATUS.READY) return 2;
  if (code === ORDER_STATUS.COMPLETED) return 3;

  const normalized = normalizeStatus(value);

  if (normalized === 'pemesanan' || normalized === 'menunggu' || normalized === 'pending') return 0;
  if (normalized === 'pembayaran' || normalized === 'paid' || normalized === 'dibayar') return 1;
  if (normalized === 'proses' || normalized === 'diproses' || normalized === 'processing') return 2;
  if (normalized === 'siap diambil' || normalized === 'siap_diambil' || normalized === 'ready') return 3;
  if (normalized === 'selesai' || normalized === 'done' || normalized === 'completed') return 4;

  return 1;
};

const formatOrderTime = (value) => {
  if (!value) return '';

  if (typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    const [hoursRaw, minutes] = value.split(':');
    const hours = Number(hoursRaw);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = ((hours + 11) % 12) + 1;
    return `${String(displayHours).padStart(2, '0')}:${minutes} ${period}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return normalizeText(value);

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const formatOrderDate = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return normalizeText(value);

  const parts = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).formatToParts(date);

  const getPart = (type) => parts.find((part) => part.type === type)?.value || '';
  return `${getPart('weekday')}, ${getPart('day')}-${getPart('month')}-${getPart('year')}`;
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

const buildOrderItem = (row) => {
  const quantity = parseNumber(row.quantity);
  const priceAtTime = parseNumber(row.price_at_time ?? row.priceAtTime);
  const imageUrl = normalizeText(row.product_image || row.image_url) || FALLBACK_IMAGE;

  return {
    id: row.item_id ?? row.id ?? null,
    productId: row.product_id ?? null,
    name: normalizeText(row.product_name || row.name) || 'Menu',
    category: normalizeText(row.product_category || row.category) || 'Menu',
    imageUrl,
    quantity,
    priceAtTime,
    notes: normalizeText(row.item_notes || row.notes),
    subtotal: parseNumber(row.item_subtotal ?? row.subtotal, quantity * priceAtTime),
    size: normalizeText(row.size || row.item_size || 'Normal') || 'Normal',
  };
};

const groupOrders = (rows) => {
  const grouped = new Map();

  rows.forEach((row) => {
    const orderId = row.order_id ?? row.id;

    if (!grouped.has(orderId)) {
      grouped.set(orderId, {
        id: orderId,
        userId: row.user_id ?? null,
        groupSessionId: row.group_session_id ?? null,
        totalAmount: parseNumber(row.total_amount ?? row.totalAmount),
        status: formatStatusLabel(row.status),
        statusRaw: normalizeStatus(row.status),
        orderType: normalizeOrderType(row.order_type),
        isPreorder: Boolean(Number(row.is_preorder ?? row.isPreorder ?? 0)),
        tableNumber: row.table_number ?? null,
        pickupTime: row.pickup_time ?? null,
        pickupNote: normalizeText(row.pickup_note ?? row.pickupNote),
        createdAt: row.created_at ?? row.createdAt ?? null,
        currentStep: statusToStep(row.status),
        items: [],
      });
    }

    const order = grouped.get(orderId);
    const item = buildOrderItem(row);

    if (row.item_id != null || row.product_id != null || row.product_name || row.name) {
      order.items.push(item);
    }
  });

  return Array.from(grouped.values()).map((order) => {
    const totalQuantity = order.items.reduce((sum, item) => sum + parseNumber(item.quantity), 0);
    const primaryItem = order.items[0] || {
      id: null,
      productId: null,
      name: `Pesanan #${order.id}`,
      category: 'Menu',
      imageUrl: FALLBACK_IMAGE,
      quantity: totalQuantity || 1,
      priceAtTime: order.totalAmount,
      notes: '',
      subtotal: order.totalAmount,
    };

    return {
      ...order,
      totalQuantity: totalQuantity || parseNumber(primaryItem.quantity, 0),
      primaryItem,
      infoTime: formatOrderTime(order.pickupTime || order.createdAt),
      infoDate: formatOrderDate(order.createdAt || order.pickupTime),
    };
  });
};

const listOrders = async ({ userId, userEmail, userName } = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    return [];
  }

  const query = `
    SELECT
      o.id AS order_id,
      o.user_id,
      o.group_session_id,
      o.total_amount,
      o.status,
      o.order_type,
      o.is_preorder,
      o.table_number,
      o.pickup_time,
      o.pickup_note,
      o.created_at,
      oi.id AS item_id,
      oi.product_id,
      oi.quantity,
      oi.price_at_time,
      oi.notes AS item_notes,
      p.name AS product_name,
      p.category AS product_category,
      p.image_url AS product_image
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC, o.id DESC, oi.id ASC
  `;

  const [rows] = await withTimeout(db.execute(query, [resolvedUserId]));
  return groupOrders(rows);
};

const groupBaristaOrders = (rows) => {
  const grouped = new Map();

  rows.forEach((row) => {
    const orderId = row.order_id ?? row.id;

    if (!grouped.has(orderId)) {
      grouped.set(orderId, {
        id: orderId,
        userId: row.user_id ?? null,
        customerName: normalizeText(row.customer_name || row.username || row.user_name) || 'Pelanggan',
        groupSessionId: row.group_session_id ?? null,
        groupCode: normalizeText(row.group_code),
        totalAmount: parseNumber(row.total_amount ?? row.totalAmount),
        status: formatStatusLabel(row.status),
        statusRaw: normalizeStatusCode(row.status),
        orderType: normalizeOrderType(row.order_type),
        isPreorder: Boolean(Number(row.is_preorder ?? row.isPreorder ?? 0)),
        tableNumber: row.table_number ?? null,
        pickupTime: row.pickup_time ?? null,
        pickupNote: normalizeText(row.pickup_note ?? row.pickupNote),
        createdAt: row.created_at ?? row.createdAt ?? null,
        currentStep: statusToStep(row.status),
        items: [],
      });
    }

    const order = grouped.get(orderId);
    const item = buildOrderItem(row);

    if (row.item_id != null || row.product_id != null || row.product_name || row.name) {
      order.items.push(item);
    }
  });

  return Array.from(grouped.values()).map((order) => {
    const totalQuantity = order.items.reduce((sum, item) => sum + parseNumber(item.quantity), 0);
    const primaryItem = order.items[0] || {
      id: null,
      productId: null,
      name: `Order #${order.id}`,
      category: 'Menu',
      imageUrl: FALLBACK_IMAGE,
      quantity: totalQuantity || 1,
      priceAtTime: order.totalAmount,
      notes: '',
      subtotal: order.totalAmount,
      size: 'Normal',
    };

    return {
      ...order,
      totalQuantity: totalQuantity || parseNumber(primaryItem.quantity, 0),
      primaryItem,
      infoTime: formatOrderTime(order.pickupTime || order.createdAt),
      infoDate: formatOrderDate(order.createdAt || order.pickupTime),
    };
  });
};

const listBaristaOrders = async () => {
  const query = `
    SELECT
      o.id AS order_id,
      o.user_id,
      o.group_session_id,
      o.total_amount,
      o.status,
      o.order_type,
      o.is_preorder,
      o.table_number,
      o.pickup_time,
      o.pickup_note,
      o.created_at,
      u.username AS customer_name,
      u.email AS customer_email,
      gs.group_code,
      oi.id AS item_id,
      oi.product_id,
      oi.quantity,
      oi.price_at_time,
      oi.notes AS item_notes,
      p.name AS product_name,
      p.category AS product_category,
      p.image_url AS product_image
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    LEFT JOIN group_sessions gs ON gs.id = o.group_session_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE (
      LOWER(CAST(o.status AS CHAR)) IN ('pending', 'processing', 'ready')
      OR o.status IN (0, 1, 2)
    )
    ORDER BY o.created_at ASC, o.id ASC, oi.id ASC
  `;

  const [rows] = await withTimeout(db.execute(query));
  return groupBaristaOrders(rows);
};

const updateOrderStatus = async ({ orderId, status }) => {
  const numericOrderId = Number.parseInt(orderId, 10);
  if (!Number.isFinite(numericOrderId) || numericOrderId <= 0) {
    const error = new Error('orderId wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  const nextStatus = normalizeStatusCode(status);
  
  // TAMBAHKAN ORDER_STATUS.COMPLETED DI DALAM ARRAY BERIKUT:
  if (![ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING, ORDER_STATUS.READY, ORDER_STATUS.COMPLETED].includes(nextStatus)) {
    const error = new Error('Status pesanan tidak valid');
    error.statusCode = 400;
    throw error;
  }

  await withTimeout(
    db.execute('UPDATE orders SET status = ? WHERE id = ?', [nextStatus, numericOrderId])
  );

  return listBaristaOrders();
};

const getActiveSession = async (connection, userId) => {
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

  return rows[0] || null;
};

const getCheckoutCartRows = async (connection, sessionId, userId) => {
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
  );

  return rows;
};

const createCheckoutOrder = async ({
  userId,
  userEmail,
  userName,
  orderType = 'dine-in',
  paymentMethod = 'Cashier',
  promoCode = '',
  tableNumber = null,
  pickupTime = null,
  pickupNote = '',
  isPreorder = false,
  splitBills = [],
} = {}) => {
  const resolvedUserId = await resolveUserId({ userId, userEmail, userName });
  if (!resolvedUserId) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const session = await getActiveSession(connection, resolvedUserId);
    if (!session) {
      const error = new Error('Keranjang kosong');
      error.statusCode = 400;
      throw error;
    }

    const rows = await getCheckoutCartRows(connection, session.id, resolvedUserId);
    if (!rows.length) {
      const error = new Error('Keranjang kosong');
      error.statusCode = 400;
      throw error;
    }

    const items = rows.map((row) => {
      const quantity = parseNumber(row.quantity, 1);
      const unitPrice = parseNumber(row.product_price, 0);

      return {
        productId: row.product_id,
        quantity,
        priceAtTime: unitPrice,
        subtotal: quantity * unitPrice,
        notes: normalizeText(row.product_description),
        name: normalizeText(row.product_name) || 'Menu',
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    let discountAmount = 0;
    let promoClaim = null;
    const normalizedPromoCode = normalizeText(promoCode);

    if (normalizedPromoCode) {
      const [promoRows] = await withTimeout(
        connection.execute(
          `
          SELECT
            ucp.id AS claim_id,
            ucp.promo_id,
            ucp.unique_code,
            ucp.is_used,
            wp.discount_amount,
            wp.is_active
          FROM user_promo_claims ucp
          INNER JOIN weekly_promos wp ON wp.id = ucp.promo_id
          WHERE ucp.user_id = ? AND ucp.unique_code = ?
          LIMIT 1
          `,
          [resolvedUserId, normalizedPromoCode]
        )
      );

      promoClaim = promoRows[0] || null;

      if (!promoClaim) {
        const error = new Error('Kode promo tidak ditemukan');
        error.statusCode = 404;
        throw error;
      }

      if (!promoClaim.is_active) {
        const error = new Error('Promo sudah tidak aktif');
        error.statusCode = 400;
        throw error;
      }

      if (Number(promoClaim.is_used)) {
        const error = new Error('Promo sudah digunakan');
        error.statusCode = 409;
        throw error;
      }

      discountAmount = Math.min(subtotal, parseNumber(promoClaim.discount_amount, 0));
    }

    const totalAmount = Math.max(subtotal - discountAmount, 0);
    const pickupNoteText = [
      paymentMethod ? `Pembayaran: ${normalizeText(paymentMethod)}` : '',
      normalizedPromoCode ? `Promo: ${normalizedPromoCode}` : '',
      normalizeText(pickupNote) ? `Catatan: ${normalizeText(pickupNote)}` : '',
    ]
      .filter(Boolean)
      .join(' | ') || null;

    const [orderResult] = await withTimeout(
      connection.execute(
        `
        INSERT INTO orders (
          user_id,
          group_session_id,
          total_amount,
          status,
          order_type,
          is_preorder,
          table_number,
          pickup_time,
          pickup_note
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          resolvedUserId,
          session.id,
          totalAmount,
          ORDER_STATUS.PENDING,
          normalizeOrderType(orderType),
          isPreorder ? 1 : 0,
          tableNumber || null,
          pickupTime || null,
          pickupNoteText,
        ]
      )
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await withTimeout(
        connection.execute(
          `
          INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price_at_time,
            notes
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            orderId,
            item.productId,
            item.quantity,
            item.priceAtTime,
            item.notes || `Dibeli melalui checkout ${orderType}`,
          ]
        )
      );
    }

    if (promoClaim) {
      await withTimeout(
        connection.execute(
          `
          UPDATE user_promo_claims
          SET is_used = 1, used_at = NOW()
          WHERE id = ?
          `,
          [promoClaim.claim_id]
        )
      );
    }

    if (Array.isArray(splitBills) && splitBills.length > 0) {
      for (const bill of splitBills) {
        const splitUserId = await resolveUserId({
          userId: bill.userId,
          userEmail: bill.userEmail,
          userName: bill.userName,
        });

        if (!splitUserId) {
          const error = new Error('Data split bill tidak valid');
          error.statusCode = 400;
          throw error;
        }

        const amountToPay = parseNumber(bill.amountToPay ?? bill.amount, 0);

        await withTimeout(
          connection.execute(
            `
            INSERT INTO split_bills (order_id, user_id, amount_to_pay, payment_status)
            VALUES (?, ?, ?, ?)
            `,
            [orderId, splitUserId, amountToPay, normalizeText(bill.paymentStatus) || 'pending']
          )
        );
      }
    }

    await withTimeout(
      connection.execute('DELETE FROM group_cart_items WHERE group_session_id = ? AND user_id = ?', [
        session.id,
        resolvedUserId,
      ])
    );

    await withTimeout(
      connection.execute("UPDATE group_sessions SET status = 'checkout' WHERE id = ?", [session.id])
    );

    await connection.commit();

    return {
      order: {
        id: orderId,
        userId: resolvedUserId,
        groupSessionId: session.id,
        totalAmount,
        subtotal,
        discountAmount,
        status: ORDER_STATUS.PENDING,
        orderType: normalizeOrderType(orderType),
        isPreorder: Boolean(isPreorder),
        tableNumber: tableNumber || null,
        pickupTime: pickupTime || null,
        pickupNote: pickupNoteText,
      },
      items,
      subtotal,
      discountAmount,
      totalAmount,
      session: {
        id: session.id,
        groupCode: session.group_code,
        status: 'checkout',
      },
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  listOrders,
  statusToStep,
  createCheckoutOrder,
  listBaristaOrders,
  updateOrderStatus,
  ORDER_STATUS,
};
