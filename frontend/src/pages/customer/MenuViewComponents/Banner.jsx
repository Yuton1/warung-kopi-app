import React, { useState, useEffect } from 'react';
// Misalkan kamu menggunakan axios atau fetch di services/api.js
// import { getBanners } from '../../../services/api'; 

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data dari Database/API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const dummyData = [
          {
            id: 1,
            title: "Promo Kopi Susu",
            subtitle: "Beli 1 gratis 1 khusus hari Senin pagi.",
            image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
            target_url: "/menu"
          },
          {
            id: 2,
            title: "Voucher Member",
            subtitle: "Kumpulkan 10 poin untuk diskon 50%.",
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
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (loading) return <div className="h-[250px] bg-gray-100 animate-pulse rounded-2xl" />;
  if (banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-[#F5F5F5]">
      {/* Container Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((item) => (
          <div key={item.id} className="min-w-full relative h-[250px] md:h-[350px]">
            {/* Image dari Database */}
            <img 
              src={item.image_url} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Konten */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-10 text-white">
              {/* Batasan Judul 20 Huruf */}
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                {item.title.length > 20 ? item.title.substring(0, 20) + "..." : item.title}
              </h2>
              
              {/* Batasan Subjudul 50 Huruf */}
              <p className="text-sm md:text-lg mb-6 opacity-90 max-w-[50ch]">
                {item.subtitle.length > 50 ? item.subtitle.substring(0, 50) + "..." : item.subtitle}
              </p>
              
              {/* Tombol Detail Dinamis */}
              <a 
                href={item.target_url}
                className="bg-[#D17842] hover:bg-[#B65E2D] text-white font-semibold py-2 px-6 rounded-lg w-fit transition-all"
              >
                Detail
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Indikator Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? "bg-white w-4" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;