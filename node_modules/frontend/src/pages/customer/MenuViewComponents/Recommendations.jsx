import React from 'react';

const Recommendations = ({ items = [] }) => {
  // Sesuai permintaan Anda: Jika menu kurang dari 6, jangan tampilkan apa pun
  if (items.length < 6) return null;

  return (
    <section className="w-full bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <span className="text-[12px] font-medium text-gray-400 uppercase tracking-widest block mb-1">
            Personal Suggestions
          </span>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Rekomendasi Untuk Kamu
          </h2>
        </div>

        {/* Grid Display - Full Width & Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item) => (
            <div 
              key={item.id} 
              className="flex items-center p-5 bg-[#fdf5ed] rounded-3xl border border-orange-50 transition-all hover:shadow-md group cursor-pointer"
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
                <h3 className="text-xl font-extrabold text-gray-800 leading-tight mt-0.5">
                  {item.name}
                </h3>
                <p className="text-md font-semibold text-gray-600 mt-1">
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