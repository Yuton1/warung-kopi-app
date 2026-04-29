const db = require('../config/db');

const subscriptionAccent = ['plan-amber', 'plan-brown', 'plan-cream'];

const normalizeSubscription = (row, index = 0) => {
  const durationDays = Number(row.duration_days ?? 30);
  const periodLabel = durationDays <= 7 ? 'Minggu' : 'Bulan';

  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price ?? 0),
    quota_cups: Number(row.quota_cups ?? 0),
    duration_days: durationDays,
    quota: `${Number(row.quota_cups ?? 0)} Cup / ${periodLabel}`,
    accent: subscriptionAccent[index % subscriptionAccent.length],
    created_at: row.created_at,
  };
};

const listSubscriptions = async () => {
  const [rows] = await db.query(`
    SELECT
      id,
      name,
      description,
      price,
      quota_cups,
      duration_days,
      created_at
    FROM subscription_plans
    ORDER BY price ASC, id ASC
  `);

  return rows.map((row, index) => normalizeSubscription(row, index));
};

module.exports = { listSubscriptions };
