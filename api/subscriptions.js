const { subscriptions } = require('./catalog-data');

module.exports = (req, res) => {
  res.status(200).json(subscriptions);
};
