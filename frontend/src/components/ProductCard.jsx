import { useState } from 'react'
import { formatRupiah } from '../utils/formatRupiah'

const ProductCard = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onViewDetail
}) => {
  // Ukuran tetap ada untuk keperluan logic Keranjang, tapi UI diubah menjadi informasi statis
  const selectedSize = 'Normal' 

  return (
    /* Container dengan Golden Ratio Padding (p-[26px]) */
    <article className="bg-white rounded-[2.5rem] p-[26px] shadow-2xl flex flex-col w-full max-w-[420px] font-['Fredoka'] border border-gray-50 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(74,55,40,0.15)] hover:-translate-y-1">
      
      {/* --- BAGIAN 1: VISUAL FULL (Tanpa Side Padding) --- */}
      <div className="relative aspect-[1.618/1] w-[calc(100%+52px)] -ml-[26px] -mt-[26px] bg-[#4A3728] rounded-t-[2.5rem] rounded-b-[2rem] overflow-hidden mb-7 group">
        {/* Badge Best Seller & New */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {product.isBestSeller && (
            <span className="bg-[#FF6E00] text-white px-5 py-1.5 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider animate-pulse">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#A0FF6D] text-[#1A1A1A] px-5 py-1.5 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider">
              New Menu
            </span>
          )}
        </div>

        {/* Ikon Heart (Favorit) */}
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-6 right-6 z-10 transition-all hover:scale-125 active:scale-90"
        >
          <i 
            className={`fa-solid fa-heart text-[42px] drop-shadow-lg ${isFavorite ? 'text-red-600' : 'text-white/80'}`}
          ></i>
        </button>

        <img 
          src={product.image || '/Gambar_Login.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      </div>

      {/* --- BAGIAN 2: NAMA MENU & IKON --- */}
      <div className="flex justify-between items-start mb-6 px-1">
        <h3 className="text-[36px] font-semibold text-[#4A3728] leading-[1.1] tracking-tight w-[70%]">
          {product.name || 'Nama menu'}
        </h3>

        {/* Ikon Karakteristik Sesuai Gambar image_1a53d2.png */}
        <div className="flex gap-3 text-[#4A3728] text-2xl pt-2">
          {product.category?.toLowerCase() === 'coffee' && (
             <i className="fa-solid fa-mug-saucer border-b-2 border-[#4A3728] pb-0.5" title="Coffee"></i>
          )}
          <i className="fa-solid fa-snowflake" title="Ice"></i>
          <i className="fa-solid fa-fire-flame-simple" title="Hot"></i>
        </div>
      </div>

      {/* --- BAGIAN 3: INFORMASI UKURAN (STATIS / BUKAN TOMBOL) --- */}
      <div className="flex gap-3 mb-8 px-1">
        <div className="bg-[#FFC444] text-[#4A3728] px-8 py-2.5 rounded-2xl font-normal text-lg shadow-sm border border-[#FFC444]">
          Normal
        </div>
        <div className="bg-[#FF6E00] text-white px-10 py-2.5 rounded-2xl font-normal text-lg shadow-sm border border-[#FF6E00]">
          Besar
        </div>
      </div>

      {/* --- BAGIAN 4: HARGA --- */}
      <div className="mb-8 px-1">
        <p className="text-xl text-[#4A3728]/60 font-medium mb-1">Harga</p>
        <strong className="text-[48px] font-semibold text-[#4A3728] leading-none tracking-tighter">
          {formatRupiah(product.price) || 'Rp Harga'}
        </strong>
      </div>

      {/* --- BAGIAN 5: AKSI UTAMA DENGAN GOLDEN RATIO WIDTH --- */}
      <div className="flex gap-4 mt-auto">
        <button 
          type="button" 
          onClick={() => onViewDetail(product.id)}
          className="flex-1 bg-[#FFC444] text-[#4A3728] py-5 rounded-[1.5rem] !font-semibold text-xl hover:bg-[#ffbc2d] transition-all active:scale-95 shadow-lg shadow-yellow-600/10"
        >
          Detail
        </button>
        <button 
          type="button" 
          onClick={() => onAddToCart(product, selectedSize)}
          className="flex-[1.618] bg-[#FF6E00] text-white py-5 rounded-[1.5rem] !font-semibold text-xl hover:bg-[#e66300] transition-all active:scale-95 shadow-lg shadow-orange-600/20 flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-cart-shopping"></i>
          Keranjang
        </button>
      </div>

    </article>
  )
}

export default ProductCard