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
  const period = String(value || 'monthly').toLowerCase()

  if (period === 'weekly') return 'weekly'
  if (period === 'yearly') return 'yearly'
  return 'monthly'
}

const periodLabelMap = {
  weekly: 'Minggu Ini',
  monthly: 'Bulan Ini',
  yearly: 'Tahun Ini',
}

const startOfDay = (date) => {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

const addDays = (date, amount) => {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

const startOfWeek = (date) => {
  const next = startOfDay(date)
  const mondayOffset = (next.getDay() + 6) % 7
  next.setDate(next.getDate() - mondayOffset)
  return next
}

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)

const startOfYear = (date) => new Date(date.getFullYear(), 0, 1)

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatMonthKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

const formatDayLabel = (date) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
  }).format(date)

const formatMonthLabel = (date) =>
  new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    year: 'numeric',
  }).format(date)

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
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
      .then(([rows]) => rows?.[0]?.COLUMN_NAME || 'created_at')
      .catch((error) => {
        orderDateColumnPromise = null
        throw error
      })
  }

  return orderDateColumnPromise
}

const getPeriodWindow = (period) => {
  const now = new Date()
  const endExclusive = addDays(startOfDay(now), 1)

  if (period === 'weekly') {
    return {
      label: periodLabelMap.weekly,
      start: startOfWeek(now),
      endExclusive,
      mode: 'daily',
    }
  }

  if (period === 'yearly') {
    return {
      label: periodLabelMap.yearly,
      start: startOfYear(now),
      endExclusive,
      mode: 'monthly',
    }
  }

  return {
    label: periodLabelMap.monthly,
    start: startOfMonth(now),
    endExclusive,
    mode: 'daily',
  }
}

const buildSeries = ({ mode, start, endInclusive, rows }) => {
  const seriesMap = new Map()

  rows.forEach((row) => {
    const key = String(row.bucket_key || '').trim()
    if (!key) return

    seriesMap.set(key, {
      value: toNumber(row.total_revenue, 0),
      orders: toNumber(row.total_orders, 0),
    })
  })

  const series = []

  if (mode === 'monthly') {
    const cursor = new Date(start)
    while (cursor <= endInclusive) {
      const key = formatMonthKey(cursor)
      const matched = seriesMap.get(key) || { value: 0, orders: 0 }
      series.push({
        key,
        label: formatMonthLabel(cursor),
        value: matched.value,
        orders: matched.orders,
      })
      cursor.setMonth(cursor.getMonth() + 1)
      cursor.setDate(1)
    }
    return series
  }

  const cursor = new Date(start)
  while (cursor <= endInclusive) {
    const key = formatDateKey(cursor)
    const matched = seriesMap.get(key) || { value: 0, orders: 0 }
    series.push({
      key,
      label: formatDayLabel(cursor),
      value: matched.value,
      orders: matched.orders,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return series
}

const getSalesReportData = async (periodInput = 'monthly') => {
  const period = normalizePeriod(periodInput)
  const orderDateColumn = await resolveOrderDateColumn()
  const orderDateExpr = `o.${orderDateColumn}`
  const { label: periodLabel, start, endExclusive, mode } = getPeriodWindow(period)
  const statusFilter = `LOWER(COALESCE(o.status, '')) NOT IN ('dibatalkan', 'cancelled')`
  const rangeParams = [start, endExclusive]

  const [summaryRows] = await withTimeout(
    db.execute(
      `
      SELECT
        COALESCE(SUM(o.total_amount), 0) AS total_revenue,
        COUNT(*) AS total_transactions
      FROM orders o
      WHERE ${orderDateExpr} >= ?
        AND ${orderDateExpr} < ?
        AND ${statusFilter}
      `,
      rangeParams
    )
  )

  const totalRevenue = toNumber(summaryRows[0]?.total_revenue, 0)
  const totalTransactions = toNumber(summaryRows[0]?.total_transactions, 0)
  const averageOrder = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0

  const [seriesRows] = await withTimeout(
    db.execute(
      mode === 'monthly'
        ? `
          SELECT
            DATE_FORMAT(${orderDateExpr}, '%Y-%m-01') AS bucket_key,
            DATE_FORMAT(${orderDateExpr}, '%b %Y') AS bucket_label,
            COALESCE(SUM(o.total_amount), 0) AS total_revenue,
            COUNT(*) AS total_orders
          FROM orders o
          WHERE ${orderDateExpr} >= ?
            AND ${orderDateExpr} < ?
            AND ${statusFilter}
          GROUP BY bucket_key, bucket_label
          ORDER BY bucket_key ASC
        `
        : `
          SELECT
            DATE(${orderDateExpr}) AS bucket_key,
            DATE_FORMAT(DATE(${orderDateExpr}), '%d %b') AS bucket_label,
            COALESCE(SUM(o.total_amount), 0) AS total_revenue,
            COUNT(*) AS total_orders
          FROM orders o
          WHERE ${orderDateExpr} >= ?
            AND ${orderDateExpr} < ?
            AND ${statusFilter}
          GROUP BY bucket_key, bucket_label
          ORDER BY bucket_key ASC
        `,
      rangeParams
    )
  )

  const endInclusive = startOfDay(new Date())
  const salesSeries = buildSeries({
    mode,
    start,
    endInclusive,
    rows: seriesRows,
  })

  const [topProductRows] = await withTimeout(
    db.execute(
      `
      SELECT
        COALESCE(p.id, oi.product_id) AS id,
        COALESCE(p.name, CONCAT('Produk #', oi.product_id)) AS name,
        COALESCE(SUM(oi.quantity), 0) AS total_sold,
        COALESCE(SUM(oi.quantity * COALESCE(oi.price_at_time, p.price, 0)), 0) AS total_revenue
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE ${orderDateExpr} >= ?
        AND ${orderDateExpr} < ?
        AND ${statusFilter}
      GROUP BY COALESCE(p.id, oi.product_id), COALESCE(p.name, CONCAT('Produk #', oi.product_id))
      ORDER BY total_sold DESC, total_revenue DESC, id DESC
      LIMIT 5
      `,
      rangeParams
    )
  )

  return {
    period,
    periodLabel,
    summary: {
      totalRevenue,
      totalTransactions,
      averageOrder,
    },
    salesSeries,
    topProducts: topProductRows.map((row) => ({
      id: row.id,
      name: row.name,
      totalSold: toNumber(row.total_sold, 0),
      totalRevenue: toNumber(row.total_revenue, 0),
    })),
  }
}

module.exports = {
  getSalesReportData,
}
