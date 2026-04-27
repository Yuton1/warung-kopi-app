import { useMemo, useState } from 'react'
import { formatRupiah } from '../utils/formatRupiah'

const FALLBACK_SIZES = [{ label: 'Porsi', factor: 1, note: '1 porsi' }]

const ProductCard = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onAddToGroup,
}) => {
  const sizes = product.sizes?.length ? product.sizes : FALLBACK_SIZES
  const [selectedSize, setSelectedSize] = useState(sizes[Math.min(1, sizes.length - 1)])

  const activeSize = sizes.find((item) => item.label === selectedSize?.label) || sizes[0]

  const price = useMemo(() => {
    const basePrice = Number(product.price) || 0
    const factor = activeSize?.factor ?? 1
    return Math.round(basePrice * factor)
  }, [activeSize, product.price])

  const handleAddToCart = () => {
    onAddToCart(product, activeSize, price)
  }

  const handleAddToGroup = () => {
    onAddToGroup(product, activeSize, price)
  }

  return (
    <article className={`product-card ${product.accent || ''}`}>
      <div className="product-card__art">
        <div className="product-card__art-radial" />
        <div className="product-card__art-chip">
          <span className="product-card__initials">{product.initials || 'WK'}</span>
        </div>
        <button
          type="button"
          className={`product-card__favorite ${isFavorite ? 'is-active' : ''}`}
          onClick={() => onToggleFavorite(product.id)}
        >
          {isFavorite ? 'Disimpan' : 'Favorit'}
        </button>
      </div>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.category}</span>
          <span>{product.badge}</span>
        </div>

        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-card__sizes">
          {sizes.map((size) => {
            const isActive = activeSize.label === size.label

            return (
              <button
                key={size.label}
                type="button"
                className={`size-pill ${isActive ? 'is-active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                <span>{size.label}</span>
                <small>{size.note}</small>
              </button>
            )
          })}
        </div>

        <div className="product-card__price-row">
          <div>
            <span>Harga</span>
            <strong>{formatRupiah(price)}</strong>
          </div>
          <div>
            <span>Poin</span>
            <strong>{product.points}</strong>
          </div>
        </div>

        <div className="product-card__actions">
          <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
            Tambah ke Keranjang
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleAddToGroup}>
            Tambah ke Grup
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
