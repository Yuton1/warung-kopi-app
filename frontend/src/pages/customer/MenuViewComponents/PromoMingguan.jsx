import { Link } from 'react-router-dom';
import { promoSeed } from '../../../data/promoSeed';

const PromoMingguan = () => {
  const promos = promoSeed;
  const heroPromo = promos[0] || null;

  return (
    <section className="promo-banner">
      {heroPromo && (
        <div className="promo-banner__copy">
          <span className="eyebrow text-4xl">Promo Minggu Ini</span>
          <h2>{heroPromo.title}</h2>
          <p>{heroPromo.description}</p>
          <div className="promo-banner__actions">
            <Link to="/promo" className="btn btn-primary">Lihat semua promo</Link>
          </div>
        </div>
      )}

      <div className="promo-banner__rail">
        {promos.slice(1).map((promo) => (
          <article key={promo.id} className={`promo-rail-card ${promo.accent || 'promo-brown'}`}>
            <strong>{promo.title}</strong>
            <p className="font-mono font-bold text-xs">{promo.code}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PromoMingguan;
