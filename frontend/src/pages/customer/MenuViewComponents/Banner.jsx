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
            subtitle: "Jangan Sampai Kelewatan", // Diubah menjadi teks kecil di atas
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

  if (loading) return <div className="h-[250px] md:h-[350px] bg-gray-100 animate-pulse rounded-3xl" />;
  if ((banners || []).length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-lg bg-[#F5F5F5]">
      {/* Container Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[250px] md:h-[350px]"
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
            
            {/* Overlay Konten - Menggunakan gradient yang lebih soft */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-between p-6 md:p-10 text-white">
              
              {/* Teks Bagian Atas */}
              <div className="mt-2 md:mt-4">
                {/* Subtitle sebagai Eyebrow text */}
                <p className="text-xs md:text-sm mb-1 opacity-90 font-light tracking-wide">
                  {shorten(item?.subtitle, 50)}
                </p>
                
                {/* Title utama */}
                <h2 className="text-2xl md:text-4xl font-bold tracking-wide">
                  {shorten(item?.title, 20)}
                </h2>
              </div>
              
              {/* Tombol Detail di Kiri Bawah */}
              <div className="mb-6 md:mb-2">
                <a 
                  href={item.target_url}
                  className="bg-[#FF6E00] hover:bg-[#e66300] text-white text-sm md:text-base font-medium py-2 px-8 rounded-full w-fit transition-all shadow-md inline-block"
                >
                  Detail
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indikator Garis & Titik di Bawah Tengah */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Pindah ke slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? "bg-white w-10" // Garis panjang untuk yang aktif
                : "bg-white/50 w-2 hover:bg-white/80" // Titik pendek untuk yang tidak aktif
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;