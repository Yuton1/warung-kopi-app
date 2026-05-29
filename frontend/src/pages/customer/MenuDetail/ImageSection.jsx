import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"

const ImageSection = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [animateHeart, setAnimateHeart] = useState(false)

  const defaultImage =
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1600&auto=format&fit=crop"
  const imageSrc = product?.image_url || product?.image || defaultImage

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite)
    setAnimateHeart(true)
    // Reset animasi ketukan jantung setelah 300ms
    setTimeout(() => setAnimateHeart(false), 300)
  }

  return (
    <section className="group relative w-full h-full min-h-[320px] md:min-h-[450px] lg:min-h-[500px] overflow-hidden bg-[#4A3728]">
      
      {/* Gambar Menu dengan Efek Hover Parallax Zoom-In */}
      <img
        src={imageSrc}
        alt={product?.name || "Coffee Menu"}
        className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
      />

      {/* Gradasi Overlay Gelap Lembut (Bikin text/badge kontras & gampang dibaca) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/30 transition-opacity duration-300 group-hover:opacity-90" />

      {/* SISI KIRI: Badge Status Menu */}
      <div className="absolute top-6 left-16 md:left-24 transition-transform duration-300 hover:scale-105">
        <span className="inline-block bg-[#FF6E00] text-white text-xs md:text-sm font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-[0_8px_20px_rgba(255,110,0,0.3)] border border-white/10">
          {product?.badge || 'Best Seller'}
        </span>
      </div>

      {/* SISI KANAN: Tombol Favorit Interaktif dengan Feedback Animasi */}
      <div className="absolute top-5 right-6 md:right-8 flex flex-col items-center z-10">
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#4A3728] shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110 active:scale-90 group/btn"
        >
          <FontAwesomeIcon
            icon={isFavorite ? faHeart : faHeartRegular}
            className={`text-2xl transition-all duration-200 ${
              isFavorite 
                ? "text-red-500 drop-shadow-[0_4px_8px_rgba(239,68,68,0.4)]" 
                : "text-[#6f6257] group-hover/btn:text-red-400"
            } ${animateHeart ? "animate-[ping_0.3s_ease-in-out_1]" : ""}`}
          />
        </button>

        <span className="text-[11px] mt-1.5 font-bold uppercase tracking-wider text-white drop-shadow-md select-none">
          {isFavorite ? 'Disukai' : 'Favorit'}
        </span>
      </div>

      {/* DEKORASI ESTETIK LAYOUT: Sisi Lengkung Halus di Bagian Bawah Gambar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#F3E9DD] rounded-t-[32px] md:rounded-t-[48px]" />
    </section>
  )
}

export default ImageSection