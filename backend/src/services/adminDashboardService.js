const db = require('../config/db')

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs)
  })

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer))
}

let orderDateColumnPromise = null

const normalizePeriod = (value) => {
  const period = String(value || 'Daily').toLowerCase()

  if (period === 'weekly') return 'Weekly'
  if (period === 'monthly') return 'Monthly'
  if (period === 'yearly') return 'Yearly'
  return 'Daily'
}

const resolveOrderDateColumn = async () => {
  if (!orderDateColumnPromise) {
    orderDateColumnPromise = withTimeout(
      db.execute(
        `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'orders'
          AND COLUMN_NAME IN ('created_at', 'pickup_time')
        ORDER BY FIELD(COLUMN_NAME, 'created_at', 'pickup_time')
        LIMIT 1
        `
      )
    )
      .then(([rows]) => rows?.[0]?.COLUMN_NAME || null)
      .catch((error) => {
        orderDateColumnPromise = null
        throw error
      })
  }

  return orderDateColumnPromise
}

const getOrderDateExpressions = (period, columnName) => {
  if (!columnName) {
    return {
      dateExpr: 'DATE(NOW())',
      labelExpr: "DATE_FORMAT(NOW(), '%d %b')",
      rangeExpr: '1=1',
      orderByExpr: 'o.id DESC',
    }
  }

  const orderDateExpr = `o.${columnName}`

  switch (period) {
    case 'Weekly':
      return {
        dateExpr: `DATE_SUB(DATE(${orderDateExpr}), INTERVAL WEEKDAY(${orderDateExpr}) DAY)`,
        labelExpr: `DATE_FORMAT(DATE_SUB(DATE(${orderDateExpr}), INTERVAL WEEKDAY(${orderDateExpr}) DAY), '%d %b')`,
        rangeExpr: `${orderDateExpr} >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)`,
        orderByExpr: `${orderDateExpr} DESC, o.id DESC`,
      }
    case 'Monthly':
      return {
        dateExpr: `DATE_FORMAT(${orderDateExpr}, '%Y-%m-01')`,
        labelExpr: `DATE_FORMAT(${orderDateExpr}, '%b %Y')`,
        rangeExpr: `${orderDateExpr} >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)`,
        orderByExpr: `${orderDateExpr} DESC, o.id DESC`,
      }
    case 'Yearly':
      return {
        dateExpr: `DATE_FORMAT(${orderDateExpr}, '%Y-01-01')`,
        labelExpr: `DATE_FORMAT(${orderDateExpr}, '%Y')`,
        rangeExpr: `${orderDateExpr} >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)`,
        orderByExpr: `${orderDateExpr} DESC, o.id DESC`,
      }
    case 'Daily':
    default:
      return {
        dateExpr: `DATE(${orderDateExpr})`,
        labelExpr: `DATE_FORMAT(${orderDateExpr}, '%d %b')`,
        rangeExpr: `${orderDateExpr} >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
        orderByExpr: `${orderDateExpr} DESC, o.id DESC`,
      }
  }
}

const money = (value) => Number(value || 0)

const getDashboardSummary = async (periodInput = 'Daily') => {
  const period = normalizePeriod(periodInput)
  const orderDateColumn = await resolveOrderDateColumn()
  const dateConfig = getOrderDateExpressions(period, orderDateColumn)
  const orderDateSelect = orderDateColumn ? `o.${orderDateColumn}` : 'NULL'

  const [revenueRows] = await withTimeout(
    db.execute(
      `
      SELECT COALESCE(SUM(total_amount), 0) AS total_earnings
      FROM orders o
      WHERE ${dateConfig.rangeExpr}
        AND LOWER(COALESCE(o.status, '')) NOT IN ('dibatalkan', 'cancelled')
      `
    )
  )

  const [newCustomerRows] = await withTimeout(
    db.execute(
      `
      SELECT COUNT(*) AS new_customers
      FROM users
      WHERE created_at >= CASE
        WHEN ? = 'Weekly' THEN DATE_SUB(CURDATE(), INTERVAL 28 DAY)
        WHEN ? = 'Monthly' THEN DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        WHEN ? = 'Yearly' THEN DATE_SUB(CURDATE(), INTERVAL 5 YEAR)
        ELSE DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      END
      `,
      [period, period, period]
    )
  )

  const [ordersRows] = await withTimeout(
    db.execute(
      `
      SELECT COUNT(*) AS total_orders,
             SUM(CASE WHEN LOWER(COALESCE(o.status, '')) NOT IN ('dibatalkan', 'cancelled') THEN 1 ELSE 0 END) AS processed_orders
      FROM orders o
      WHERE ${dateConfig.rangeExpr}
      `
    )
  )

  const [loyaltyRows] = await withTimeout(
    db.execute(
      `
      SELECT COALESCE(SUM(points), 0) AS total_points,
             COUNT(*) AS active_members
      FROM users
      WHERE points > 0
      `
    )
  )

  const [salesRows] = await withTimeout(
    db.execute(
      `
      SELECT
        ${dateConfig.dateExpr} AS period_date,
        ${dateConfig.labelExpr} AS period_label,
        COALESCE(SUM(o.total_amount), 0) AS total_value,
        COUNT(*) AS order_count
      FROM orders o
      WHERE ${dateConfig.rangeExpr}
        AND LOWER(COALESCE(o.status, '')) NOT IN ('dibatalkan', 'cancelled')
      GROUP BY period_date, period_label
      ORDER BY period_date ASC
      `
    )
  )

  const [recentRows] = await withTimeout(
    db.execute(
      `
      SELECT
        o.id,
        o.total_amount,
        o.status,
        ${orderDateSelect} AS created_at,
        u.username,
        u.email
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY ${dateConfig.orderByExpr}
      LIMIT 6
      `
    )
  )

  const [topProductRows] = await withTimeout(
    db.execute(
      `
      SELECT
        p.id,
        p.name,
        COALESCE(SUM(oi.quantity), 0) AS total_sold
      FROM order_items oi
      LEFT JOIN products p ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC, p.id DESC
      LIMIT 5
      `
    )
  )

  return {
    period,
    stats: {
      totalEarnings: money(revenueRows[0]?.total_earnings),
      newCustomers: Number(newCustomerRows[0]?.new_customers || 0),
      ordersProcessed: Number(ordersRows[0]?.processed_orders || 0),
      loyaltyPoints: Number(loyaltyRows[0]?.total_points || 0),
      activeMembers: Number(loyaltyRows[0]?.active_members || 0),
      totalOrders: Number(ordersRows[0]?.total_orders || 0),
    },
    salesSeries: salesRows.map((row) => ({
      label: row.period_label,
      value: money(row.total_value),
      orders: Number(row.order_count || 0),
    })),
    recentOrders: recentRows.map((row) => ({
      id: row.id,
      customerName: row.username || row.email || `Order #${row.id}`,
      totalAmount: money(row.total_amount),
      status: String(row.status || '').trim() || 'Proses',
      createdAt: row.created_at,
    })),
    topProducts: topProductRows
      .filter((row) => row.id != null)
      .map((row) => ({
        id: row.id,
        name: row.name || 'Menu',
        totalSold: Number(row.total_sold || 0),
      })),
  }
}

module.exports = {
  getDashboardSummary,
}
