const express = require('express');
const router = express.Router();
const {
  getActiveSession,
  lockSession,
  updateMembers,
} = require('../controllers/groupController');

router.get('/active', getActiveSession);
router.put('/update-members', updateMembers);
router.post('/lock', lockSession);

module.exports = router;
