import React from 'react';
import ProductCard from '../../../components/ProductCard';

const MenuGrid = ({ 
  menu = [], 
  loading, 
  favoriteIdSet, 
  toggleFavorite, 
  addToCart, 
  addToGroup, 
  menuRef 
}) => {
  return (
    <section className="w-full py-12 px-4 md:px-8 lg:px-12" id="menu-section" ref={menuRef}>
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.2em] block mb-2">
            Personal Suggestions
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {loading ? 'Memuat Menu...' : 'Menu Sering di Pesan'}
          </h2>
        </div>

        {/* Grid Layout - 3 Kolom sesuai referensi gambar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {!loading && menu.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favoriteIdSet.has(Number(product.id))}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addToCart}
              onAddToGroup={addToGroup}
            />
          ))}
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-900"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuGrid;