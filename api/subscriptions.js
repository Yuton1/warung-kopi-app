const { getSubscriptions } = require('../backend/src/controllers/subscriptionController');

module.exports = async (req, res) => {
  return getSubscriptions(req, res);
};
