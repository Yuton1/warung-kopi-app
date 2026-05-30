const { getSalesReportData } = require('../services/salesReportService')

const getSalesReport = async (req, res) => {
  try {
    const report = await getSalesReportData(req.query.period || 'monthly')
    res.json(report)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal memuat laporan penjualan',
      error: error.message,
    })
  }
}

module.exports = {
  getSalesReport,
}
