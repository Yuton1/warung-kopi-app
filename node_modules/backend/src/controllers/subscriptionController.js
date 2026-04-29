const { listSubscriptions } = require('../services/subscriptionService');
const { subscriptions: fallbackSubscriptions } = require('../../../api/catalog-data');

const getSubscriptions = async (req, res) => {
  try {
    const rows = await listSubscriptions();
    return res.json(rows);
  } catch (error) {
    console.error('Gagal ambil subscriptions dari TiDB:', error.message);
    return res.json(fallbackSubscriptions);
  }
};

module.exports = { getSubscriptions };
