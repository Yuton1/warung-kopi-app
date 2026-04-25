import { Link } from 'react-router-dom'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
import { formatRupiah } from '../../utils/formatRupiah'

const OrdersPage = () => {
  const history = readStoredValue(STORAGE_KEYS.history, [])
  const preOrder = readStoredValue(STORAGE_KEYS.preorder, null)
  const latest = history[0]

  return (
    <div className="screen-shell">
      <section className="screen-hero screen-hero--split">
        <div>
          <span className="eyebrow">Pesanan Saya</span>
          <h1>Tracking status order dan riwayat transaksi yang rapi.</h1>
          <p>
            Halaman ini membantu user melihat pesanan yang sedang aktif, status pre-order, dan histori pembelian
            sebelumnya tanpa perlu bolak-balik ke menu.
          </p>
        </div>

        <div className="screen-hero__card">
          <span className="eyebrow">Order aktif</span>
          <strong>{preOrder ? preOrder.status : 'Belum ada order aktif'}</strong>
          <p>{preOrder ? `Pickup jam ${preOrder.pickupTime}` : 'Checkout dari halaman menu untuk mulai order.'}</p>
          <Link to="/" className="btn btn-secondary">
            Buka menu
          </Link>
        </div>
      </section>

      <section className="feature-grid">
        <article className="surface-card">
          <div className="section-head section-head--tight">
            <div>
              <span className="eyebrow">Status berjalan</span>
              <h2>Pesanan yang sedang diproses</h2>
            </div>
          </div>

          {preOrder ? (
            <div className="order-status-card">
              <div>
                <span>Kode pre-order</span>
                <strong>{preOrder.code}</strong>
              </div>
              <div>
                <span>Waktu ambil</span>
                <strong>{preOrder.pickupTime}</strong>
              </div>
              <div>
                <span>Item</span>
                <strong>{preOrder.items.length}</strong>
              </div>
              <p>{preOrder.note || 'Tidak ada catatan tambahan.'}</p>
            </div>
          ) : (
            <div className="empty-state empty-state--wide">
              <strong>Belum ada pesanan yang sedang aktif.</strong>
              <p>Gunakan fitur pre-order di menu untuk menjadwalkan pesanan berikutnya.</p>
            </div>
          )}
        </article>

        <article className="surface-card">
          <div className="section-head section-head--tight">
            <div>
              <span className="eyebrow">Riwayat Pesanan</span>
              <h2>{history.length ? 'Transaksi terakhir' : 'Belum ada riwayat'}</h2>
            </div>
          </div>

          <div className="timeline-list">
            {history.length ? (
              history.map((order) => (
                <article key={order.code} className="timeline-card">
                  <div className="timeline-card__head">
                    <div>
                      <span>{order.code}</span>
                      <strong>{new Date(order.createdAt).toLocaleString('id-ID')}</strong>
                    </div>
                    <strong>{formatRupiah(order.total)}</strong>
                  </div>
                  <p>
                    {order.items.length} item, meja {order.tableNumber || '-'}, ambil {order.pickupTime || '-'}
                  </p>
                </article>
              ))
            ) : (
              <div className="empty-state empty-state--wide">
                <strong>Riwayat masih kosong.</strong>
                <p>Setelah checkout pertama, order akan muncul di halaman ini.</p>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="metrics-row">
        <article className="metric-card">
          <span>Total riwayat</span>
          <strong>{history.length}</strong>
        </article>
        <article className="metric-card">
          <span>Total belanja</span>
          <strong>{formatRupiah(history.reduce((total, order) => total + order.total, 0))}</strong>
        </article>
        <article className="metric-card">
          <span>Order terakhir</span>
          <strong>{latest ? latest.code : '-'}</strong>
        </article>
      </section>
    </div>
  )
}

export default OrdersPage

