const db = require('../config/db');

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

const FALLBACK_IMAGE = '/Logo_Warkop_Nav.png';

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeText = (value) => String(value ?? '').trim();

const normalizeStatus = (value) => normalizeText(value).toLowerCase();

const formatStatusLabel = (value) => {
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
  const normalized = normalizeStatus(value);

  if (normalized === 'pemesanan' || normalized === 'menunggu' || normalized === 'pending') return 0;
  if (normalized === 'pembayaran' || normalized === 'paid' || normalized === 'dibayar') return 1;
  if (normalized === 'proses' || normalized === 'diproses') return 2;
  if (normalized === 'siap diambil' || normalized === 'siap_diambil') return 3;
  if (normalized === 'selesai' || normalized === 'done' || normalized === 'completed') return 4;

  return 2;
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

  return {
    id: row.item_id ?? row.id ?? null,
    productId: row.product_id ?? null,
    name: normalizeText(row.product_name || row.name) || 'Menu',
    category: normalizeText(row.product_category || row.category) || 'Menu',
    imageUrl: normalizeText(row.product_image || row.image_url) || FALLBACK_IMAGE,
    quantity,
    priceAtTime,
    notes: normalizeText(row.item_notes || row.notes),
    subtotal: parseNumber(row.item_subtotal ?? row.subtotal, quantity * priceAtTime),
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
        orderType: normalizeText(row.order_type),
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

module.exports = {
  listOrders,
  statusToStep,
};
