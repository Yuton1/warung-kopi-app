const express = require('express')
const router = express.Router()
const { getDailyReport } = require('../controllers/baristaReportController')

router.get('/reports/daily', getDailyReport)

module.exports = router
