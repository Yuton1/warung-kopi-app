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
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/me', getCurrentUserProfile);
router.put('/me', updateCurrentUserProfile);
router.get('/addresses', getUserAddresses);
router.post('/addresses', createUserAddress);
router.patch('/addresses/:addressId/default', updateDefaultUserAddress);
router.delete('/addresses/:addressId', removeUserAddress);

module.exports = router;
