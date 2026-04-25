import { Link } from 'react-router-dom'
import { promoSeed } from '../../data/promoSeed'

const PromoPage = () => {
  return (
    <div className="screen-shell">
      <section className="screen-hero">
        <div>
          <span className="eyebrow">Promo / Penawaran Spesial</span>
          <h1>Promo yang tampil dulu di banner, lalu dibuka lengkap di sini.</h1>
          <p>
            Fokusnya ke upselling yang tetap terasa natural: bundle, voucher, dan loyalty boost untuk pelanggan yang
            sering order.
          </p>
        </div>

        <div className="screen-hero__card">
          <span className="eyebrow">Voucher aktif</span>
          <strong>{promoSeed[0].code}</strong>
          <p>{promoSeed[0].badge}</p>
          <Link to="/" className="btn btn-secondary">
            Coba dari menu
          </Link>
        </div>
      </section>

      <section className="promo-grid">
        {promoSeed.map((promo) => (
          <article key={promo.id} className={`promo-card ${promo.accent}`}>
            <div className="promo-card__top">
              <span>{promo.badge}</span>
              <strong>{promo.code}</strong>
            </div>
            <h2>{promo.title}</h2>
            <p>{promo.description}</p>
            <div className="promo-card__actions">
              <button type="button" className="btn btn-primary">
                Pakai kode
              </button>
              <span className="hint-text">Berlaku untuk customer page</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default PromoPage

