const { getProducts } = require('../backend/src/controllers/productController');

module.exports = async (req, res) => {
  return getProducts(req, res);
};
