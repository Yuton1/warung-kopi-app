const {
  listAdminPromos,
  createAdminPromo,
  updateAdminPromo,
  deleteAdminPromo,
} = require('../services/promoService')

const getAdminPromos = async (req, res) => {
  try {
    const rows = await listAdminPromos()
    res.json(rows)
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memuat promo admin',
      error: error.message,
    })
  }
}

const createAdminPromoHandler = async (req, res) => {
  try {
    const promo = await createAdminPromo(req.body || {})
    res.status(201).json(promo)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal menyimpan promo admin',
      error: error.message,
    })
  }
}

const updateAdminPromoHandler = async (req, res) => {
  try {
    const promo = await updateAdminPromo(req.params.id, req.body || {})
    res.json(promo)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal memperbarui promo admin',
      error: error.message,
    })
  }
}

const deleteAdminPromoHandler = async (req, res) => {
  try {
    const result = await deleteAdminPromo(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Gagal menghapus promo admin',
      error: error.message,
    })
  }
}

module.exports = {
  getAdminPromos,
  createAdminPromoHandler,
  updateAdminPromoHandler,
  deleteAdminPromoHandler,
}
