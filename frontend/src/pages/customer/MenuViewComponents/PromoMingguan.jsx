import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Pastikan axios sudah terinstal

const PromoMingguan = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data promo dari database (via Backend)
  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      // Endpoint ini nantinya akan melakukan JOIN antara weekly_promos & user_promo_claims
      const response = await axios.get('/api/promos/weekly');
      setPromos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil promo:", error);
      setLoading(false);
    }
  };

  const handleClaim = async (promoId) => {
    try {
      const response = await axios.post('/api/promos/claim', { promoId });
      if (response.data.success) {
        alert(`Berhasil! Kode unik Anda: ${response.data.unique_code}`);
        fetchPromos(); // Refresh data agar status tombol berubah
      }
    } catch (error) {
      alert(error.response?.data?.message || "Gagal klaim promo");
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat promo...</div>;

  // Gunakan promo pertama sebagai Hero (yang besar di kiri)
  const heroPromo = promos || null;

  return (
    <section className="promo-banner">
      {heroPromo && (
        <div className="promo-banner__copy">
          <span className="eyebrow">Promo Minggu Ini</span>
          <h2>{heroPromo.title}</h2>
          <p>{heroPromo.description}</p>
          <div className="promo-banner__actions">
            <Link to="/promo" className="btn btn-primary">Lihat semua promo</Link>
            
            {heroPromo.is_claimed ? (
              <span className="promo-code-chip promo-code-chip--active">
                KODE: {heroPromo.unique_code}
              </span>
            ) : (
              <button 
                onClick={() => handleClaim(heroPromo.id)}
                className="promo-code-chip promo-code-chip--button"
                disabled={heroPromo.remaining_quota <= 0}
              >
                {heroPromo.remaining_quota <= 0 ? 'Kuota Habis' : 'Klaim Promo'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="promo-banner__rail">
        {promos.slice(1).map((promo) => (
          <article key={promo.id} className={`promo-rail-card ${promo.accent || 'promo-brown'}`}>
            <strong>{promo.title}</strong>
            {promo.is_claimed ? (
              <p className="font-mono font-bold text-xs">{promo.unique_code}</p>
            ) : (
              <button 
                onClick={() => handleClaim(promo.id)}
                className="text-[10px] mt-2 underline"
              >
                Klaim Sekarang
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default PromoMingguan;