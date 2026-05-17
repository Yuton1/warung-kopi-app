const express = require('express');
const router = express.Router();
const {
  getUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/me', getCurrentUserProfile);
router.put('/me', updateCurrentUserProfile);

module.exports = router;
