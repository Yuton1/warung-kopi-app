import MenuGrid from './MenuViewComponents/MenuGrid'
import { useCatalogProducts } from '../../hooks/useCatalogProducts'
import { filterProductsByMenuCategory, MENU_CATEGORY_ROUTES } from '../../utils/menuCategories'

const CategoryMenuPage = ({ categoryKey }) => {
  const { products, loading } = useCatalogProducts()
  const categoryConfig = MENU_CATEGORY_ROUTES[categoryKey] || MENU_CATEGORY_ROUTES.minuman
  const filteredProducts = filterProductsByMenuCategory(products, categoryKey)

  return (
    <div className="page-shell min-h-screen bg-white">
      <section className="w-full px-6 lg:px-12 py-8">
        <MenuGrid
          menu={filteredProducts}
          loading={loading}
          limit={null}
          eyebrow={categoryConfig.eyebrow}
          title={categoryConfig.title}
          emptyMessage={`Belum ada produk kategori ${categoryConfig.title.toLowerCase()}.`}
        />
      </section>
    </div>
  )
}

export default CategoryMenuPage
