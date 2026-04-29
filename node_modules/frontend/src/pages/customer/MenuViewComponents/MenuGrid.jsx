import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi
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
  const navigate = useNavigate();

  // Membatasi hanya 12 item pertama
  const displayedMenu = menu.slice(0, 12);

  return (
    <section className="w-full py-8 px-2" id="menu-section" ref={menuRef}>
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-8 text-left flex justify-between items-end">
          <div>
            <span className="text-[15px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
              Personal Suggestions
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900">
              {loading ? 'Memuat Menu...' : 'Menu Sering di Pesan'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!loading && displayedMenu.map((product) => (
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

        {/* Tombol See All Menu - Muncul jika menu lebih dari 12 */}
        {!loading && menu.length > 12 && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => navigate('/menu')} // Sesuaikan path dengan route menu kamu
              className="px-8 py-3 bg-[#2c1b0e] text-white rounded-full font-semibold hover:bg-[#6a452d] transition-colors shadow-lg"
            >
              See All Menu
            </button>
          </div>
        )}
        
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