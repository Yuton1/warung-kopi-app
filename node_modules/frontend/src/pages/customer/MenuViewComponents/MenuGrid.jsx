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
  const safeMenu = Array.isArray(menu) ? menu : [];

  return (
    <section className="w-full py-8 px-2" id="menu-section" ref={menuRef}>
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-8 text-left">
          <span className="text-[15px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
            Personal Suggestions
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900">
            {loading ? 'Memuat Menu...' : 'Menu Sering di Pesan'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!loading && safeMenu.map((product) => (
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
