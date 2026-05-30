const express = require('express')
const router = express.Router()
const { getDashboard } = require('../controllers/adminDashboardController')
const { getSalesReport } = require('../controllers/salesReportController')

router.get('/dashboard', getDashboard)
router.get('/reports', getSalesReport)

module.exports = router
