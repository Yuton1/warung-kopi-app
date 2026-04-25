import { formatRupiah } from '../utils/formatRupiah'

const CartFloating = ({
  cart,
  subtotal,
  tableNumber,
  pickupTime,
  orderNote,
  preOrder,
  loyaltyPoints,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onTableNumberChange,
  onPickupTimeChange,
  onOrderNoteChange,
  onSavePreOrder,
  onCancelPreOrder,
  onCheckout,
}) => {
  const cartCount = cart.reduce((total, item) => total + item.qty, 0)

  return (
    <aside className="summary-panel" id="cart-panel">
      <div className="summary-panel__header">
        <div>
          <span className="eyebrow">Pemesanan Aktif</span>
          <h2>Keranjang & Pre-order</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onClearCart} disabled={!cart.length}>
          Kosongkan
        </button>
      </div>

      <div className="summary-panel__inputs">
        <label className="field">
          <span>Nomor meja</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Contoh 12"
            value={tableNumber}
            onChange={(event) => onTableNumberChange(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Jam ambil</span>
          <input
            type="time"
            value={pickupTime}
            onChange={(event) => onPickupTimeChange(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Catatan pesanan</span>
          <textarea
            rows="3"
            placeholder="Contoh: 1 latte tanpa gula, 1 americano panas"
            value={orderNote}
            onChange={(event) => onOrderNoteChange(event.target.value)}
          />
        </label>
      </div>

      <div className="summary-panel__stats">
        <div className="summary-stat">
          <span>Total item</span>
          <strong>{cartCount}</strong>
        </div>
        <div className="summary-stat">
          <span>Poin aktif</span>
          <strong>{loyaltyPoints}</strong>
        </div>
      </div>

      <div className="cart-list">
        {cart.length === 0 ? (
          <div className="empty-state">
            <strong>Keranjang masih kosong.</strong>
            <p>Pilih menu, pilih ukuran, lalu tambahkan ke keranjang.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={`${item.id}-${item.size.label}`} className="cart-row">
              <div className="cart-row__content">
                <strong>{item.name}</strong>
                <span>
                  {item.size.label} - {formatRupiah(item.price)}
                </span>
              </div>
              <div className="cart-row__controls">
                <button type="button" onClick={() => onUpdateQuantity(item.id, item.size.label, -1)}>
                  -
                </button>
                <span>{item.qty}</span>
                <button type="button" onClick={() => onUpdateQuantity(item.id, item.size.label, 1)}>
                  +
                </button>
              </div>
              <button type="button" className="link-button" onClick={() => onRemoveItem(item.id, item.size.label)}>
                Hapus
              </button>
            </div>
          ))
        )}
      </div>

      <div className="summary-panel__total">
        <div>
          <span>Subtotal</span>
          <strong>{formatRupiah(subtotal)}</strong>
        </div>
        <div>
          <span>Perkiraan poin</span>
          <strong>{Math.floor(subtotal / 1000)}</strong>
        </div>
      </div>

      <div className="summary-panel__actions">
        <button type="button" className="btn btn-secondary" onClick={onSavePreOrder} disabled={!cart.length}>
          Simpan Pre-order
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancelPreOrder} disabled={!preOrder}>
          Batalkan Pre-order
        </button>
        <button type="button" className="btn btn-primary" onClick={onCheckout} disabled={!cart.length}>
          Pesan Sekarang
        </button>
      </div>

      <div className="preorder-card">
        <div className="preorder-card__head">
          <span className="eyebrow">Status Pre-order</span>
          <strong>{preOrder ? preOrder.status : 'Belum ada jadwal'}</strong>
        </div>
        {preOrder ? (
          <>
            <p>
              Ambil pukul <strong>{preOrder.pickupTime}</strong> dengan {preOrder.items.length} menu.
            </p>
            <p className="preorder-card__note">{preOrder.note || 'Tidak ada catatan tambahan.'}</p>
          </>
        ) : (
          <p>Atur jadwal ambil dulu, lalu simpan pre-order dari keranjang.</p>
        )}
      </div>
    </aside>
  )
}

export default CartFloating
