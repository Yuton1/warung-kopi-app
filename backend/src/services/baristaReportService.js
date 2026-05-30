const db = require('../config/db')

const withTimeout = (operation, timeoutMs = 5000) => {
  let timer

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database request timeout')), timeoutMs)
  })

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer))
}

let orderDateColumnPromise = null

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeText = (value) => String(value ?? '').trim()

const formatHourLabel = (hourNumber) => `${String(hourNumber).padStart(2, '0')}:00`

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
      .then(([rows]) => rows?.[0]?.COLUMN_NAME || 'created_at')
      .catch((error) => {
        orderDateColumnPromise = null
        throw error
      })
  }

  return orderDateColumnPromise
}

const getDayWindow = () => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const endExclusive = new Date(start)
  endExclusive.setDate(endExclusive.getDate() + 1)

  return { start, endExclusive }
}

const getBaristaDailyReportData = async () => {
  const orderDateColumn = await resolveOrderDateColumn()
  const orderDateExpr = `o.${orderDateColumn}`
  const { start, endExclusive } = getDayWindow()
  const statusFilter = `LOWER(COALESCE(o.status, '')) NOT IN ('dibatalkan', 'cancelled')`

  const [summaryRows] = await withTimeout(
    db.execute(
      `
      SELECT
        COALESCE(SUM(o.total_amount), 0) AS total_earnings,
        COUNT(*) AS total_transactions
      FROM orders o
      WHERE ${orderDateExpr} >= ?
        AND ${orderDateExpr} < ?
        AND ${statusFilter}
      `,
      [start, endExclusive]
    )
  )

  const totalEarnings = parseNumber(summaryRows[0]?.total_earnings, 0)
  const totalTransactions = parseNumber(summaryRows[0]?.total_transactions, 0)
  const averageOrderValue = totalTransactions > 0 ? Math.round(totalEarnings / totalTransactions) : 0

  const [hourlyRows] = await withTimeout(
    db.execute(
      `
      SELECT
        HOUR(${orderDateExpr}) AS hour_number,
        DATE_FORMAT(${orderDateExpr}, '%H:00') AS time,
        COALESCE(SUM(o.total_amount), 0) AS sales
      FROM orders o
      WHERE ${orderDateExpr} >= ?
        AND ${orderDateExpr} < ?
        AND ${statusFilter}
      GROUP BY hour_number, time
      ORDER BY hour_number ASC
      `,
      [start, endExclusive]
    )
  )

  const [topProductRows] = await withTimeout(
    db.execute(
      `
      SELECT
        COALESCE(p.id, oi.product_id) AS id,
        COALESCE(p.name, CONCAT('Produk #', oi.product_id)) AS name,
        COALESCE(SUM(oi.quantity), 0) AS sold,
        COALESCE(SUM(oi.quantity * COALESCE(oi.price_at_time, p.price, 0)), 0) AS revenue
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE ${orderDateExpr} >= ?
        AND ${orderDateExpr} < ?
        AND ${statusFilter}
      GROUP BY COALESCE(p.id, oi.product_id), COALESCE(p.name, CONCAT('Produk #', oi.product_id))
      ORDER BY sold DESC, revenue DESC, id DESC
      LIMIT 4
      `,
      [start, endExclusive]
    )
  )

  return {
    totalEarnings,
    totalTransactions,
    averageOrderValue,
    hourlySales: hourlyRows.map((row) => ({
      time: normalizeText(row.time) || formatHourLabel(parseNumber(row.hour_number, 0)),
      sales: parseNumber(row.sales, 0),
    })),
    topProducts: topProductRows.map((row) => ({
      id: row.id,
      name: normalizeText(row.name) || 'Menu',
      sold: parseNumber(row.sold, 0),
      revenue: parseNumber(row.revenue, 0),
    })),
  }
}

module.exports = {
  getBaristaDailyReportData,
}
