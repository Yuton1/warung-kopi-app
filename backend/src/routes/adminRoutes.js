const express = require('express')
const router = express.Router()
const { getDashboard } = require('../controllers/adminDashboardController')
const { getSalesReport } = require('../controllers/salesReportController')
const {
  getAdminPromos,
  createAdminPromoHandler,
  updateAdminPromoHandler,
  deleteAdminPromoHandler,
} = require('../controllers/adminPromoController')

router.get('/dashboard', getDashboard)
router.get('/reports', getSalesReport)
router.get('/promos', getAdminPromos)
router.post('/promos', createAdminPromoHandler)
router.put('/promos/:id', updateAdminPromoHandler)
router.delete('/promos/:id', deleteAdminPromoHandler)

module.exports = router
