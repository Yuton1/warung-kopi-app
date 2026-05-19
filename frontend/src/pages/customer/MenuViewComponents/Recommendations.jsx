const Recommendations = ({ items = [] }) => {
  const safeItems = Array.isArray(items) ? items : [];

  // Sesuai permintaan Anda: Jika menu kurang dari 6, jangan tampilkan apa pun
  if (safeItems.length < 6) return null;

  return (
    // Mengubah px-6 menjadi px-2 (atau px-0 jika ingin nempel rata) agar tidak terlalu menjorok ke tengah
    <section className="w-full px-2 py-10 font-['Fredoka']">
      <div className="w-full">
        {/* Header Section - Rata kiri selaras dengan pembungkus luarnya */}
        <div className="mb-8 pl-2">
          <span className="text-[12px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
            Personal Suggestions
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#4A3728] tracking-tight">
            Rekomendasi Untuk Kamu
          </h2>
        </div>

        {/* Grid Display - Responsif: 1 kolom di HP, 2 di tablet, 3 di desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeItems.slice(0, 6).map((item, index) => (
            <div 
              key={item.id} 
              className="flex items-center p-5 bg-[#fdf5ed] rounded-[2rem] border border-orange-50 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group cursor-pointer animate-[fadeInUp_0.5s_ease-out_forwards]"
              // TRIK UTAMA: Efek animasi satu per satu menggunakan delay bertahap berdasarkan index item
              style={{ 
                animationDelay: `${index * 150}ms`,
                opacity: 0 // Menghindari kedipan sebelum animasi dimulai
              }}
            >
              {/* Menu Image / Art Box */}
              <div className="w-20 h-20 bg-[#4a342e] rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-2xl">
                    ☕
                  </div>
                )}
              </div>

              {/* Menu Details */}
              <div className="ml-5">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-xl font-extrabold text-gray-800 leading-tight mt-0.5 group-hover:text-[#FF6E00] transition-colors">
                  {item.name}
                </h3>
                <p className="text-md font-semibold text-[#FF6E00] mt-1">
                  Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommendations;