export const MENU_CATEGORY_ROUTES = {
  minuman: {
    title: 'Minuman',
    eyebrow: 'Makan Apa Hari ini ??',
    categories: ['coffee', 'non-coffee'],
  },
  makanan: {
    title: 'Makanan',
    eyebrow: 'Makan Apa Hari ini ??',
    categories: ['meal'],
  },
  cemilan: {
    title: 'Cemilan',
    eyebrow: 'Makan Apa Hari ini ??',
    categories: ['snack'],
  },
}

export const normalizeMenuCategoryLabel = (category) => {
  switch (String(category || '').toLowerCase()) {
    case 'coffee':
      return 'KOPI'
    case 'non-coffee':
      return 'MINUMAN'
    case 'meal':
      return 'MAKANAN'
    case 'snack':
      return 'CEMILAN'
    default:
      return String(category || '').toUpperCase()
  }
}

export const filterProductsByMenuCategory = (products, categoryKey) => {
  const categoryConfig = MENU_CATEGORY_ROUTES[categoryKey]
  const allowedCategories = categoryConfig?.categories || []

  return (Array.isArray(products) ? products : []).filter((product) =>
    allowedCategories.includes(String(product.category || '').toLowerCase())
  )
}
