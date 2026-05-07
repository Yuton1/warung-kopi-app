const { claimPromo, listWeeklyPromos } = require('../services/promoService');
const { weeklyPromos: fallbackWeeklyPromos } = require('../data/catalog-data');
const crypto = require('crypto');

const withTimeout = (operation, timeoutMs = 2500) => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
};

const getWeeklyPromos = async (req, res) => {
  try {
    const userEmail = req.query?.userEmail || req.body?.userEmail || null;
    const rows = await withTimeout(listWeeklyPromos(userEmail));
    return res.json(rows);
  } catch (error) {
    console.error('Gagal ambil weekly promos dari TiDB:', error.message);
    return res.json(fallbackWeeklyPromos);
  }
};

const claimWeeklyPromo = async (req, res) => {
  try {
    const { promoId, userEmail } = req.body || {};
    const result = await withTimeout(
      claimPromo({ promoId, userEmail: userEmail || req.query?.userEmail || null })
    );
    return res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    const fallbackCode = `WK-${String(req.body?.promoId || 'PROMO').padStart(3, '0')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    console.error('Gagal klaim promo dari TiDB:', error.message);
    return res.json({
      success: true,
      unique_code: fallbackCode,
      persisted: false,
      message: 'Promo dibuat sementara karena koneksi TiDB belum tersedia.',
    });
  }
};

module.exports = {
  getWeeklyPromos,
  claimWeeklyPromo,
};
