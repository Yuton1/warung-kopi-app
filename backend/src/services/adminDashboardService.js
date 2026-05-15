const db = require('../config/db')

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs)
  })

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer))
}

const normalizePeriod = (value) => {
  const period = String(value || 'Daily').toLowerCase()

  if (period === 'weekly') return 'Weekly'
  if (period === 'monthly') return 'Monthly'
  if (period === 'yearly') return 'Yearly'
  return 'Daily'
}

const getPeriodConfig = (period) => {
  switch (period) {
    case 'Weekly':
      return {
        dateExpr: `DATE_SUB(DATE(o.created_at), INTERVAL WEEKDAY(o.created_at) DAY)`,
        labelExpr: `DATE_FORMAT(DATE_SUB(DATE(o.created_at), INTERVAL WEEKDAY(o.created_at) DAY), '%d %b')`,
        rangeExpr: `o.created_at >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)`,
        limit: 8,
      }
    case 'Monthly':
      return {
        dateExpr: `DATE_FORMAT(o.created_at, '%Y-%m-01')`,
        labelExpr: `DATE_FORMAT(o.created_at, '%b %Y')`,
        rangeExpr: `o.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)`,
        limit: 6,
      }
    case 'Yearly':
      return {
        dateExpr: `DATE_FORMAT(o.created_at, '%Y-01-01')`,
        labelExpr: `DATE_FORMAT(o.created_at, '%Y')`,
        rangeExpr: `o.created_at >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)`,
        limit: 5,
      }
    case 'Daily':
    default:
      return {
        dateExpr: `DATE(o.created_at)`,
        labelExpr: `DATE_FORMAT(o.created_at, '%d %b')`,
        rangeExpr: `o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
        limit: 7,
      }
  }
}

const money = (value) => Number(value || 0)

const getDashboardSummary = async (periodInput = 'Daily') => {
  const period = normalizePeriod(periodInput)
  const config = getPeriodConfig(period)

  const [revenueRows] = await withTimeout(
    db.execute(
      `
      SELECT COALESCE(SUM(total_amount), 0) AS total_earnings
      FROM orders
      WHERE ${config.rangeExpr}
        AND LOWER(COALESCE(status, '')) NOT IN ('dibatalkan', 'cancelled')
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
             SUM(CASE WHEN LOWER(COALESCE(status, '')) NOT IN ('dibatalkan', 'cancelled') THEN 1 ELSE 0 END) AS processed_orders
      FROM orders
      WHERE ${config.rangeExpr}
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
        ${config.dateExpr} AS period_date,
        ${config.labelExpr} AS period_label,
        COALESCE(SUM(o.total_amount), 0) AS total_value,
        COUNT(*) AS order_count
      FROM orders o
      WHERE ${config.rangeExpr}
        AND LOWER(COALESCE(o.status, '')) NOT IN ('dibatalkan', 'cancelled')
      GROUP BY period_date, period_label
      ORDER BY period_date ASC
      LIMIT ${config.limit}
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
        o.created_at,
        u.username,
        u.email
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC, o.id DESC
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
