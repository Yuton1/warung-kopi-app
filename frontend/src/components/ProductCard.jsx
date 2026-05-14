import { useState } from 'react'
import { formatRupiah } from '../utils/formatRupiah'

const ProductCard = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onViewDetail = () => {},
}) => {
  // Tetap menggunakan 'Normal' sebagai default untuk keperluan payload keranjang
  const selectedSize = 'Normal' 

  return (
    /* Container menggunakan Golden Ratio p-[26px].
       Menambahkan efek hover shadow dan sedikit elevasi sesuai instruksi.
    */
    <article className="bg-white rounded-[2.5rem] p-[26px] shadow-2xl flex flex-col w-full max-w-[420px] font-['Fredoka'] border border-gray-50 transition-all duration-300 hover:shadow-[0_30px_60px_rgba(74,55,40,0.18)] hover:-translate-y-2">
      
      {/* --- BAGIAN 1: VISUAL (FULL WIDTH KANAN-KIRI) --- */}
      {/* w-[calc(100%+52px)] & margin negatif digunakan agar gambar menempel ke tepi card */}
      <div className="relative aspect-[1.618/1] w-[calc(100%+52px)] -ml-[26px] -mt-[26px] bg-[#4A3728] rounded-t-[2.5rem] rounded-b-[2.2rem] overflow-hidden mb-7 group">
        
        {/* Badge: Mengambil data dari kolom 'badge' di TiDB */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {product.badge && (
            <span className={`${
              product.badge.toLowerCase() === 'best seller' ? 'bg-[#FF6E00]' : 'bg-[#A0FF6D] !text-[#1A1A1A]'
            } text-white px-5 py-1.5 rounded-full text-[11px] font-bold shadow-lg uppercase tracking-wider`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Tombol Favorit: Animasi hover scale ditingkatkan */}
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-6 right-8 z-10 transition-all hover:scale-125 active:scale-90"
        >
          <i 
            className={`fa-solid fa-heart text-[44px] drop-shadow-2xl transition-colors duration-300 ${
              isFavorite ? 'text-[#FF0000]' : 'text-white/90'
            }`}
          ></i>
        </button>

        <img 
          src={product.image_url || '/Gambar_Login.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      </div>

      {/* --- BAGIAN 2: NAMA MENU & IKON KARAKTERISTIK --- */}
      <div className="flex justify-between items-start mb-5 px-1">
        <h3 className="text-[36px] font-semibold text-[#4A3728] leading-[1.1] tracking-tight w-[75%]">
          {product.name || 'Nama menu'}
        </h3>

        {/* Ikon Kanan: Sesuai image_1a53d2.png */}
        <div className="flex gap-3 text-[#4A3728] text-[26px] pt-1.5">
          {product.category?.toLowerCase() === 'coffee' && (
             <i className="fa-solid fa-mug-saucer border-b-2 border-[#4A3728] pb-0.5"></i>
          )}
          <i className="fa-solid fa-snowflake"></i>
          <i className="fa-solid fa-fire-flame-simple"></i>
        </div>
      </div>

      {/* --- BAGIAN 3: INFORMASI UKURAN (LABEL STATIS) --- */}
      {/* Mengikuti skema warna di gambar: Kuning untuk Normal, Orange untuk Besar */}
      <div className="flex gap-4 mb-8 px-1">
        <div className="bg-[#3b3b3b] text-white px-8 py-2.5 rounded-[1.2rem] font-semibold text-lg shadow-sm">
          Normal
        </div>
        <div className="bg-[#636363] text-white px-10 py-2.5 rounded-[1.2rem] font-semibold text-lg shadow-sm">
          Besar
        </div>
      </div>

      {/* --- BAGIAN 4: HARGA (UKURAN BESAR) --- */}
      <div className="mb-8 px-1">
        <p className="text-xl text-[#4A3728]/60 font-medium mb-0">Harga</p>
        <strong className="text-[48px] font-semibold text-[#4A3728] leading-none tracking-tighter">
          {formatRupiah(product.price) || 'Rp Harga'}
        </strong>
      </div>

      {/* --- BAGIAN 5: AKSI UTAMA (GOLDEN RATIO PROPORTION) --- */}
      <div className="flex gap-4 mt-auto">
        <button 
          type="button" 
          onClick={() => onViewDetail(product.id)}
          className="flex-1 bg-[#FFC444] text-[#4A3728] py-5 rounded-[1.5rem] font-semibold text-xl hover:brightness-105 transition-all active:scale-95 shadow-lg shadow-yellow-600/10"
        >
          Detail
        </button>
        <button 
          type="button" 
          onClick={() => onAddToCart(product, selectedSize)}
          className="flex-[1.618] bg-[#FF6E00] text-white py-5 rounded-[1.5rem] font-semibold text-xl hover:brightness-105 transition-all active:scale-95 shadow-lg shadow-orange-600/20 flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-cart-shopping text-lg"></i>
          Keranjang
        </button>
      </div>

    </article>
  )
}

export default ProductCard
