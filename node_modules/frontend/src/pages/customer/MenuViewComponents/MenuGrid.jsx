import React from 'react'
import ProductCard from '../../../components/ProductCard'

const MenuGrid = ({
  menu = [],
  loading,
  favoriteIdSet = new Set(),
  toggleFavorite = () => {},
  addToCart = () => {},
  addToGroup = () => {},
  menuRef,
  limit = 12,
  eyebrow = 'Personal Suggestions',
  title = loading ? 'Memuat Menu...' : 'Menu Sering di Pesan',
  emptyMessage = 'Menu belum tersedia.',
}) => {
  const visibleMenu = typeof limit === 'number' ? menu.slice(0, limit) : menu

  return (
    <section className="w-full py-8 px-2" id="menu-section" ref={menuRef}>
      <div className="w-full">
        <div className="mb-8 text-left">
          <span className="text-[15px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
            {eyebrow}
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {!loading && visibleMenu.length > 0 ? (
            visibleMenu.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favoriteIdSet.has(Number(product.id))}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
                onAddToGroup={addToGroup}
              />
            ))
          ) : !loading ? (
            <div className="col-span-full rounded-[2rem] border border-dashed border-[#D9C5B1] bg-[#FFF8F1] px-6 py-10 text-center text-[#6A4A32]">
              {emptyMessage}
            </div>
          ) : null}
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-900"></div>
          </div>
        )}
      </div>
    </section>
  )
}

export default MenuGrid
