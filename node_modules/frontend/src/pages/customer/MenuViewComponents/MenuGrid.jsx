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
    <section className="w-full bg-[#f8f5f2] py-12 px-6" id="menu-section" ref={menuRef}>
      <div className="max-w-7xl mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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