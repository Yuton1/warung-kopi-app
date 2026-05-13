import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { readBannerList } from '../../../data/bannerStorage';

const safeText = (value, fallback = '') => String(value ?? fallback);
const shorten = (value, limit) => {
  const text = safeText(value);
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

const Banner = () => {
  const [banners, setBanners] = useState(() => readBannerList());
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const syncBanners = () => {
      setBanners(readBannerList());
    };

    syncBanners();
    window.addEventListener('warungkopi-state-changed', syncBanners);
    window.addEventListener('storage', syncBanners);

    return () => {
      window.removeEventListener('warungkopi-state-changed', syncBanners);
      window.removeEventListener('storage', syncBanners);
    };
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

  useEffect(() => {
    if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  if ((banners || []).length === 0) return null;

  const isExternalUrl = (value) => /^https?:\/\//i.test(String(value ?? ''));
  const BannerButton = ({ href, children, className }) => {
    if (isExternalUrl(href)) {
      return (
        <a href={href} className={className} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }

    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-sm bg-[#F5F5F5]">
      <div 
        className="flex transition-transform duration-700 ease-in-out w-full aspect-[720/300]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((item) => (
          <div key={item.id} className="min-w-full relative h-full">
            {/* Image dari Database */}
            <img 
              src={item?.image_url} 
              className="w-full h-full object-cover" 
              alt={shorten(item?.title, 30)} 
            />
            
            {/* Overlay Konten */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-between p-8 md:p-14 text-white">
              
              {/* Teks Bagian Atas */}
              <div className="mt-4 md:mt-8">
                <p className="text-sm md:text-base mb-2 opacity-90 font-light tracking-wider">
                  {shorten(item?.subtitle, 50)}
                </p>
                
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide">
                  {shorten(item?.title, 20)}
                </h2>

                {item?.description ? (
                  <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-white/90">
                    {shorten(item?.description, 120)}
                  </p>
                ) : null}
              </div>
              
              {/* Tombol Detail di Kiri Bawah */}
              <div className="mb-8 md:mb-6">
                <BannerButton
                  href={item.target_url}
                  className="bg-[#FF6E00] hover:bg-[#e66300] text-white text-base md:text-lg font-medium py-3 px-10 rounded-full w-fit transition-all shadow-lg inline-block"
                >
                  {shorten(item?.button_label, 24)}
                </BannerButton>
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
                ? "bg-white w-12" 
                : "bg-white/50 w-2.5 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
