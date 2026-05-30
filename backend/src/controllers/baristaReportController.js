const { getBaristaDailyReportData } = require('../services/baristaReportService')

const getDailyReport = async (req, res) => {
  try {
    const report = await getBaristaDailyReportData()
    res.json(report)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal memuat laporan barista',
      error: error.message,
    })
  }
}

module.exports = {
  getDailyReport,
}
