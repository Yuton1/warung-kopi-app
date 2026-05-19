import React from 'react';

const Recommendations = ({ items = [] }) => {
  const safeItems = Array.isArray(items) ? items : [];

  // Tetap terjaga agar komponen tidak hilang jika data di bawah 6
  if (safeItems.length < 6) return null;

  return (
    // SOLUSI TERLALU KE TENGAH: px disesuaikan agar serasi dengan layout utama tanpa batasan max-w kaku
    <section className="w-full px-4 md:px-8 py-10 font-fredoka">
      <div className="w-full">
        
        {/* Header Section - Rata Kiri Estetik */}
        <div className="mb-8 pl-1">
          <span className="text-xs font-semibold text-[#a6a6a6] uppercase tracking-widest block mb-2">
          Personal Suggestions
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#4a342e] tracking-tight">
            Rekomendasi Untuk Kamu
          </h2>
        </div>

        {/* Tag Inject Styles: Animasi Smooth murni bebas bug config */}
        <style>{`
          @keyframes estetikFadeInUp {
            0% {
              opacity: 0;
              transform: translateY(24px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .kartu-rekomendasi {
            animation: estetikFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* Grid Display - Responsif Sempurna & Full Width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeItems.slice(0, 6).map((item, index) => (
            <div 
              key={item.id} 
              className="kartu-rekomendasi flex items-center p-4 bg-[#fdf5ed] rounded-[2rem] border border-orange-100/50 shadow-[0_4px_20px_-4px_rgba(74,52,46,0.05)] transition-all duration-300 hover:shadow-[0_12px_30px_-6px_rgba(255,110,0,0.15)] hover:-translate-y-1.5 group cursor-pointer"
              style={{ 
                animationDelay: `${index * 120}ms`,
                opacity: 0 
              }}
            >
              {/* Menu Image Box */}
              <div className="w-20 h-20 bg-[#4a342e] rounded-2xl overflow-hidden flex-shrink-0 shadow-md relative">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-2xl">
                    ☕
                  </div>
                )}
              </div>

              {/* Menu Details */}
              <div className="ml-5 flex-1 min-w-0">
                {/* Badge Kategori Mini */}
                <span className="inline-block text-[10px] font-bold text-gray-400 bg-white/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                
                {/* Nama Produk */}
                <h3 className="text-lg font-extrabold text-[#4a342e] leading-tight truncate group-hover:text-[#FF6E00] transition-colors duration-200">
                  {item.name}
                </h3>
                
                {/* Harga dengan skema warna matching ikon Beli */}
                <p className="text-base font-black text-[#FF6E00] mt-1.5">
                  Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                </p>
              </div>

              {/* Aksesoris Panah Kanan Estetik pas di-hover */}
              <div className="text-gray-300 group-hover:text-[#FF6E00] group-hover:translate-x-1 transition-all duration-300 pr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Recommendations;