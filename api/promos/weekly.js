const { getWeeklyPromos } = require('../../backend/src/controllers/promoController');

module.exports = async (req, res) => {
  return getWeeklyPromos(req, res);
};
