import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { promoSeed } from '../../../data/promoSeed';
import { STORAGE_KEYS, readStoredValue } from '../../../data/customerStorage';

const PromoMingguan = () => {
  const [promos, setPromos] = useState(promoSeed);
  const [loading, setLoading] = useState(true);
  const [claimLoadingId, setClaimLoadingId] = useState(null); // Loading feedback per item
  const [authUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null));

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const response = await axios.get('/api/promos/weekly', {
        params: authUser?.email ? { userEmail: authUser.email } : {},
      });
      setPromos(Array.isArray(response.data) ? response.data : promoSeed);
    } catch (error) {
      console.error("Gagal mengambil promo:", error);
      setPromos(promoSeed);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (promoId) => {
    setClaimLoadingId(promoId);
    try {
      const response = await axios.post('/api/promos/claim', {
        promoId,
        userEmail: authUser?.email || null,
      });
      if (response.data.success) {
        fetchPromos(); // Auto refresh status data komponen
      }
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || "Gagal klaim promo");
    } finally {
      setClaimLoadingId(null);
    }
  };

  // State Loading Premium Shimmer Effect (Feedback UX Indah)
  if (loading) {
    return (
      <div className="w-full bg-[#1A120B]/50 backdrop-blur-md rounded-[2rem] p-6 border border-white/5 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-48 bg-white/5 rounded-2xl"></div>
          <div className="h-48 bg-white/5 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const safePromos = Array.isArray(promos) ? promos : promoSeed;
  const heroPromo = safePromos || null;
  const railPromos = safePromos.slice(1);

  return (
    <div className="w-full bg-gradient-to-br from-[#1A120B] to-[#2C1E12] rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[80px] -pointer-events-none"></div>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
        <div>
          <span className="text-orange-500 text-xs font-black uppercase tracking-widest block mb-1">
            Penawaran Spesial
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Promo Minggu Ini 🔥
          </h2>
        </div>
        <Link 
          to="/promo" 
          className="text-xs font-bold text-orange-400 bg-white/100 hover:bg-orange-500 hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 border border-white/10 hover:border-transparent active:scale-95"
        >
          Lihat Semua Promo →
        </Link>
      </header>

      {/* Grid Asimetris Responsif */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* HERO CARD (Promo Utama - 2 Kolom di Desktop) */}
        {heroPromo && (
          <article className="lg:col-span-2 bg-[#4A3728]/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:border-orange-500/40 group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  BIG DEAL
                </span>
                <span className="text-white/40 text-xs font-medium">
                  Sisa Kuota: {heroPromo.remaining_quota ?? 0}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2 transition-colors group-hover:text-orange-400">
                {heroPromo.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-xl">
                {heroPromo.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              {heroPromo.is_claimed ? (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    KODE: {heroPromo.unique_code}
                  </span>
                </div>
              ) : (
                <button 
                  onClick={() => handleClaim(heroPromo.id)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-300 active:scale-95 flex items-center justify-center min-w-[120px] ${
                    heroPromo.remaining_quota <= 0 
                      ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-600/20'
                  }`}
                  disabled={heroPromo.remaining_quota <= 0 || claimLoadingId === heroPromo.id}
                >
                  {claimLoadingId === heroPromo.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : heroPromo.remaining_quota <= 0 ? (
                    'Kuota Habis'
                  ) : (
                    'Klaim Voucher'
                  )}
                </button>
              )}
            </div>
          </article>
        )}

        {/* SIDE RAIL CARDS (Promo List Tambahan - 1 Kolom Samping) */}
        <div className="flex flex-col gap-4 max-h-[340px] lg:max-h-none overflow-y-auto pr-1 custom-scrollbar">
          {railPromos.length > 0 ? (
            railPromos.map((promo) => (
              <article 
                key={promo.id} 
                className="bg-black/20 hover:bg-black/40 border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-orange-400 transition-colors line-clamp-1">
                    {promo.title}
                  </h4>
                  <p className="text-white/50 text-xs line-clamp-2 mb-4">
                    {promo.description || "Ketuk klaim untuk menggunakan potongan harga menarik ini."}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  {promo.is_claimed ? (
                    <span className="font-mono text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                      {promo.unique_code}
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleClaim(promo.id)}
                      className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 group/btn disabled:opacity-50"
                      disabled={claimLoadingId === promo.id}
                    >
                      {claimLoadingId === promo.id ? (
                        <div className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>Klaim Sekarang <span className="transition-transform group-hover/btn:translate-x-1">→</span></>
                      )}
                    </button>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl p-6 text-center">
              <p className="text-xs text-white/40">Tidak ada promo tambahan tersedia</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PromoMingguan;
