const { listSubscriptions } = require('../services/subscriptionService');
const { subscriptions: fallbackSubscriptions } = require('../data/catalog-data');

const withTimeout = (operation, timeoutMs = 2500) => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

const getSubscriptions = async (req, res) => {
  try {
    const rows = await withTimeout(listSubscriptions());
    return res.json(rows);
  } catch (error) {
    console.error('Gagal ambil subscriptions dari TiDB:', error.message);
    return res.json(fallbackSubscriptions);
  }
};

module.exports = { getSubscriptions };
