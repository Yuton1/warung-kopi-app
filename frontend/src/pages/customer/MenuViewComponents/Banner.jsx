import { useState, useEffect } from 'react';

const bannerData = [
  { id: 1, title: "Promo Espresso", sub: "Nikmati aroma kopi murni pilihan terbaik kami.", btnText: "Detail", link: "#menu-section" },
  { id: 2, title: "Diskon Member", sub: "Khusus hari ini, diskon 20% untuk semua member.", btnText: "Cek Member", link: "/akun" },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === bannerData.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="home-showcase" style={{ overflow: 'hidden', position: 'relative' }}>
      <div className="home-showcase__hero" style={{ 
        display: 'flex', 
        transform: `translateX(-${current * 100}%)`, 
        transition: 'transform 0.8s ease-in-out' 
      }}>
        {bannerData.map((b) => (
          <div key={b.id} style={{ minWidth: '100%', display: 'flex', alignItems: 'center' }}>
            <div className="home-showcase__copy">
              <span className="eyebrow">Jangan Sampai Kehabisan</span>
              {/* Batasan 20 Huruf */}
              <h1>{b.title.slice(0, 20)}</h1>
              {/* Batasan 50 Huruf */}
              <p>{b.sub.slice(0, 50)}</p>
              <div className="hero-actions">
                <a href={b.link} className="btn btn-primary">{b.btnText}</a>
              </div>
            </div>
            <div className="home-showcase__art">
                <div className="hero-cup-visual" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Banner;