import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Ticket, Copy, Check, Info, ArrowLeft } from 'lucide-react';
import { promoSeed } from '../../data/promoSeed';
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage';

const PromoPage = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimLoadingId, setClaimLoadingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [authUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null));

  const fetchPromos = async () => {
    try {
      const response = await axios.get('/api/promos/weekly', {
        params: authUser?.email ? { userEmail: authUser.email } : {},
      });
      const data = response.data;
      setPromos(Array.isArray(data) && data.length > 0 ? data : promoSeed);
    } catch (error) {
      console.error("Gagal mengambil daftar promo:", error);
      setPromos(promoSeed); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleClaim = async (promoId) => {
    if (!authUser) {
      alert("Silakan login terlebih dahulu untuk mengklaim voucher promo!");
      return;
    }
    setClaimLoadingId(promoId);
    try {
      const response = await axios.post('/api/promos/claim', {
        promoId,
        userEmail: authUser.email,
      });
      if (response.data.success) {
        fetchPromos(); 
      }
    } catch (error) {
      alert(error.response?.data?.error || "Gagal mengklaim promo");
    } finally {
      setClaimLoadingId(null);
    }
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); 
  };

  // Shimmer Loading Menyesuaikan Tema Terang
  if (loading) {
    return (
      <div className="w-full pt-6 px-1 max-w-7xl mx-auto animate-pulse">
        <div className="h-4 bg-[#e2ccbb]/40 rounded w-24 mb-4"></div>
        <div className="h-44 bg-white rounded-[32px] border border-[#e2ccbb]/60 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-56 bg-white rounded-[28px] border border-[#e2ccbb]/50"></div>
          ))}
        </div>
      </div>
    );
  }

  const claimedPromo = promos.find(p => p.is_claimed);
  const highlightPromo = claimedPromo || promos[0];

  return (
    <div className="w-full pt-4 pb-12 animate-fade-in">
      
      {/* 🌟 HERO SECTION - Meniru spesifikasi premium MenuDetail */}
      <section className="relative bg-[#4A3728] rounded-[32px] p-6 md:p-8 text-white shadow-[0_20px_50px_rgba(74,55,40,0.08)] mb-8 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden">
        <div className="absolute right-[-30px] bottom-[-30px] opacity-10 text-white pointer-events-none">
          <Ticket size={180} />
        </div>
        
        <div className="max-w-xl relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6E00]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FFC444]">
            <Ticket className="h-3.5 w-3.5" />
            Promo & Penawaran Spesial
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight mt-4 mb-3 text-white">
            Makin Hemat, Makin Sering <span className="text-[#FFC444]">Nongki!</span>
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            Fokus kami memberikan keuntungan nyata untuk Anda. Klaim voucher di bawah ini, nikmati bundle menu eksklusif, dan klaim hadiah kesukaanmu.
          </p>
        </div>

        {/* Highlight Voucher Terklaim */}
        {highlightPromo && (
          <div className="w-full md:w-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 relative z-10 text-white">
            <span className="text-[10px] font-bold text-[#FFC444] uppercase tracking-wider block mb-1">
              {highlightPromo.is_claimed ? '🎉 Voucher Aktif Anda' : '🔥 Rekomendasi Hari Ini'}
            </span>
            <h3 className="text-base font-bold text-white truncate mb-3">{highlightPromo.title}</h3>
            
            <div className="bg-white/90 rounded-xl p-3 text-center relative overflow-hidden group">
              {highlightPromo.is_claimed ? (
                <div 
                  onClick={() => handleCopyCode(highlightPromo.unique_code || highlightPromo.code, highlightPromo.id)}
                  className="cursor-pointer flex items-center justify-center gap-2 text-[#4A3728]"
                >
                  <strong className="font-mono text-base font-black tracking-wider text-emerald-600">
                    {highlightPromo.unique_code || highlightPromo.code}
                  </strong>
                  {copiedId === highlightPromo.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </div>
              ) : (
                <span className="text-xs text-[#4A3728] font-bold block">
                  Sisa Kuota: {highlightPromo.remaining_quota ?? 0} Kupon
                </span>
              )}
            </div>
            <Link to="/" className="mt-3 block text-center text-[11px] font-bold text-[#FFC444] hover:underline">
              Coba gunakan di menu utama →
            </Link>
          </div>
        )}
      </section>

      {/* 📱 PROMO GRID CONTAINER */}
      <main>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-black text-[#4A3728] tracking-tight">Katalog Voucher Warung Kopi</h2>
          <div className="h-[1px] flex-grow bg-[#e2ccbb]"></div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo) => {
            const isOutOfQuota = (promo.remaining_quota ?? 1) <= 0;
            
            return (
              <article 
                key={promo.id} 
                className="bg-white border border-[#e2ccbb] hover:border-[#FF6E00]/40 rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_15px_35px_rgba(74,55,40,0.05)] hover:-translate-y-1 relative overflow-hidden group"
              >
                <div>
                  {/* Bagian Atas Card */}
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <span className="bg-[#FF6E00]/10 text-[#FF6E00] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {promo.discount_amount ? `Potongan Rp ${promo.discount_amount.toLocaleString('id-ID')}` : promo.badge || 'Spesial'}
                    </span>
                    <span className="text-[#8c7661] text-[11px] font-medium bg-[#fbf3ea] px-2 py-0.5 rounded-md">
                      Sisa: {promo.remaining_quota ?? 0}
                    </span>
                  </div>

                  {/* Judul & Deskripsi */}
                  <h3 className="text-lg font-black text-[#4A3728] mb-2 group-hover:text-[#FF6E00] transition-colors duration-200">
                    {promo.title}
                  </h3>
                  <p className="text-[#6f6257] text-xs leading-relaxed mb-6 text-justify">
                    {promo.description || "Gunakan voucher kupon ini saat checkout untuk menikmati potongan harga spesial di Warung Kopi."}
                  </p>
                </div>

                {/* Tombol dengan Feedback State */}
                <div className="pt-4 border-t border-[#f2e6dc] flex flex-col gap-2">
                  {promo.is_claimed ? (
                    // State 1: Berhasil di-klaim (Klik untuk copy)
                    <button
                      type="button"
                      onClick={() => handleCopyCode(promo.unique_code || promo.code || 'WK-PROMO', promo.id)}
                      className={`w-full py-3 rounded-xl text-xs font-mono font-black tracking-wider transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 ${
                        copiedId === promo.id 
                          ? 'bg-emerald-600 text-white shadow-md' 
                          : 'bg-emerald-50/60 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {copiedId === promo.id ? (
                        <>Tersalin! <Check className="h-3.5 w-3.5" /></>
                      ) : (
                        <>KODE: {promo.unique_code || promo.code} <Copy className="h-3.5 w-3.5 opacity-60" /></>
                      )}
                    </button>
                  ) : (
                    // State 2: Belum di-klaim / Kuota Habis
                    <button
                      type="button"
                      onClick={() => handleClaim(promo.id)}
                      disabled={isOutOfQuota || claimLoadingId === promo.id}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-98 flex items-center justify-center min-h-[42px] ${
                        isOutOfQuota 
                          ? 'bg-[#eddccf]/50 text-[#8c7661]/40 cursor-not-allowed border border-transparent' 
                          : 'bg-[#FF6E00] text-white hover:bg-[#e56300] shadow-md shadow-orange-600/10'
                      }`}
                    >
                      {claimLoadingId === promo.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : isOutOfQuota ? (
                        'Kuota Klaim Habis'
                      ) : (
                        'Klaim Voucher Ke Akun'
                      )}
                    </button>
                  )}
                  
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#8c7661]/60 italic mt-1">
                    <Info className="h-3 w-3" />
                    <span>Otomatis memotong subtotal belanja Anda di keranjang</span>
                  </div>
                </div>

              </article>
            );
          })}
        </section>
      </main>

    </div>
  );
};

export default PromoPage;