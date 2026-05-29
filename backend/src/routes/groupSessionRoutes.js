const express = require('express');
const router = express.Router();
const {
  createSession,
  getActiveSession,
  lockSession,
  updateMembers,
} = require('../controllers/groupController');

router.post('/', createSession);
router.get('/active', getActiveSession);
router.put('/update-members', updateMembers);
router.post('/lock', lockSession);

module.exports = router;
