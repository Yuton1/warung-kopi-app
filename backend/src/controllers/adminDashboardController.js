const { getDashboardSummary } = require('../services/adminDashboardService')

const getDashboard = async (req, res) => {
  try {
    const summary = await getDashboardSummary(req.query.period || 'Daily')
    res.json(summary)
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memuat dashboard admin',
      error: error.message,
    })
  }
}

module.exports = {
  getDashboard,
}
