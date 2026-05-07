const express = require('express');
const router = express.Router();
const { getWeeklyPromos, claimWeeklyPromo } = require('../controllers/promoController');

router.get('/weekly', getWeeklyPromos);
router.post('/claim', claimWeeklyPromo);

module.exports = router;
