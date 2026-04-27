import ProductCard from '../../../components/ProductCard';

const MenuGrid = ({ menu, loading, favoriteIdSet, toggleFavorite, addToCart, addToGroup, menuRef }) => (
  <section className="panel" id="menu-section" ref={menuRef}>
    <div className="section-head">
      <h2>{loading ? 'Memuat menu...' : 'Menu paling sering dipesan'}</h2>
    </div>
    <div className="menu-grid">
      {menu.map((product) => (
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
  </section>
);

export default MenuGrid;