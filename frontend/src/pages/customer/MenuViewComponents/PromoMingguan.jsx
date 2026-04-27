import { Link } from 'react-router-dom';
import { promoSeed } from '../../../data/promoSeed';

const PromoMingguan = () => (
  <section className="promo-banner">
    <div className="promo-banner__copy">
      <span className="eyebrow">Promo Minggu Ini</span>
      <h2>{promoSeed.title}</h2>
      <p>{promoSeed.description}</p>
      <div className="promo-banner__actions">
        <Link to="/promo" className="btn btn-primary">Lihat semua promo</Link>
        <span className="promo-code-chip">Kode {promoSeed.code}</span>
      </div>
    </div>
    <div className="promo-banner__rail">
      {promoSeed.map((promo) => (
        <article key={promo.id} className={`promo-rail-card ${promo.accent}`}>
          <strong>{promo.title}</strong>
          <p>{promo.code}</p>
        </article>
      ))}
    </div>
  </section>
);

export default PromoMingguan;