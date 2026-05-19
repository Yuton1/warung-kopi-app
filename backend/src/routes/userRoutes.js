const express = require('express');
const router = express.Router();
const {
  getUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getUserAddresses,
  createUserAddress,
  updateDefaultUserAddress,
  removeUserAddress,
  getUserFavorites,
  createUserFavorite,
  removeUserFavoriteByProduct,
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/me', getCurrentUserProfile);
router.put('/me', updateCurrentUserProfile);
router.get('/addresses', getUserAddresses);
router.post('/addresses', createUserAddress);
router.patch('/addresses/:addressId/default', updateDefaultUserAddress);
router.delete('/addresses/:addressId', removeUserAddress);
router.get('/favorites', getUserFavorites);
router.post('/favorites', createUserFavorite);
router.delete('/favorites/:productId', removeUserFavoriteByProduct);

module.exports = router;
