const { claimWeeklyPromo } = require('../../backend/src/controllers/promoController');

module.exports = async (req, res) => {
  return claimWeeklyPromo(req, res);
};
