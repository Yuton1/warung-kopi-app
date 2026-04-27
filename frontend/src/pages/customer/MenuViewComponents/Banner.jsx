import { useState, useEffect } from 'react';

const safeText = (value, fallback = '') => String(value ?? fallback);
const shorten = (value, limit) => {
  const text = safeText(value);
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const dummyData = [
          {
            id: 1,
            title: "Promo Mingguan",
            subtitle: "Jangan Sampai Kelewatan",
            image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
            target_url: "/menu"
          },
          {
            id: 2,
            title: "Voucher Member",
            subtitle: "Kumpulkan Poin Sekarang",
            image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
            target_url: "/akun"
          }
        ];
        
        setBanners(dummyData);
      } catch (error) {
        console.error("Gagal mengambil data banner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // 2. Animasi Auto-Slide
  useEffect(() => {
    if ((banners || []).length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  // UPDATE: Tinggi loading skeleton disamakan dan ditambah margin-bottom
  if (loading) return <div className="w-full h-[300px] md:h-[450px] bg-gray-100 animate-pulse rounded-3xl mb-12" />;
  if ((banners || []).length === 0) return null;

  return (
    // UPDATE: Menambahkan mb-12 untuk memberikan space (jarak) dengan fitur/komponen di bawahnya
    <div className="relative w-full overflow-hidden rounded-3xl shadow-lg bg-[#F5F5F5] mb-12">
      
      {/* Container Slides */}
      <div 
        // UPDATE: Mengubah h-[250px] md:h-[350px] menjadi h-[300px] md:h-[450px] agar lebih besar ke bawah
        className="flex transition-transform duration-700 ease-in-out h-[300px] md:h-[450px] lg:h-[500px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((item) => (
          <div key={item.id} className="min-w-full relative h-full">
            {/* Image dari Database */}
            <img 
              src={item.image_url} 
              alt={safeText(item.title, 'Banner Warung Kopi')}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Konten - Gradient dipertebal sedikit di bagian bawah agar teks tetap terbaca jika gambar terang */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-between p-8 md:p-14 text-white">
              
              {/* Teks Bagian Atas */}
              <div className="mt-4 md:mt-8">
                {/* Subtitle sebagai Eyebrow text */}
                <p className="text-sm md:text-base mb-2 opacity-90 font-light tracking-wider">
                  {shorten(item?.subtitle, 50)}
                </p>
                
                {/* Title utama */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide">
                  {shorten(item?.title, 20)}
                </h2>
              </div>
              
              {/* Tombol Detail di Kiri Bawah */}
              <div className="mb-8 md:mb-6">
                <a 
                  href={item.target_url}
                  className="bg-[#FF6E00] hover:bg-[#e66300] text-white text-base md:text-lg font-medium py-3 px-10 rounded-full w-fit transition-all shadow-lg inline-block"
                >
                  Detail
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indikator Garis & Titik di Bawah Tengah */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Pindah ke slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? "bg-white w-12" // Garis panjang
                : "bg-white/50 w-2.5 hover:bg-white/80" // Titik pendek
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;