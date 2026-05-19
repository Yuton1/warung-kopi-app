import { formatRupiah } from '../utils/formatRupiah';

const ProductCard = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onViewDetail = () => {},
}) => {
  const selectedSize = {
    label: 'Normal',
    note: '',
    factor: 1,
  };

  // Ubah nilai database (0 atau 1) menjadi boolean sejati agar logika aman
  const hasIce = Boolean(product.support_ice);
  const hasHot = Boolean(product.support_hot);
  const isSpicy = Boolean(product.is_spicy);
  const isSweet = Boolean(product.is_sweet);

  return (
    <article 
      onClick={() => onViewDetail(product.id)}
      className="bg-[#FFF8F0] rounded-[2.5rem] p-6 shadow-xl flex flex-col w-full max-w-[400px] font-['Fredoka'] border border-[#EFE5DA]/50 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(74,55,40,0.15)] hover:-translate-y-2 cursor-pointer animate-[fadeIn_0.6s_ease-out]"
    >
      
      {/* --- BAGIAN 1: VISUAL (IMAGE CONTAINER) --- */}
      <div className="relative aspect-[1.15/1] w-full bg-[#4A3728] rounded-[2.2rem] overflow-hidden mb-5 group">
        
        {/* Badge Status (Kiri Atas) seperti 'Best Seller' atau 'New' */}
        <div className="absolute top-5 left-5 z-10">
          {product.badge && (
            <span className={`${
              product.badge.toLowerCase() === 'best seller' ? 'bg-[#FF6E00] text-white' : 'bg-[#A0FF6D] text-[#1A1A1A]'
            } px-5 py-2 rounded-full text-sm font-bold shadow-md uppercase tracking-wider block`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* --- TOMBOL FAVORIT LOVE (Kanan Atas) --- */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Mencegah terpicunya fungsi navigasi onViewDetail card utama
            onToggleFavorite(product.id);
          }}
          className="absolute top-5 right-5 z-20 bg-white/40 backdrop-blur-md hover:bg-white/60 p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 shadow-md border border-white/20 group/fav"
          title={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
        >
          <i 
            className={`fa-solid fa-heart text-2xl drop-shadow-sm transition-all duration-300 ${
              isFavorite 
                ? 'text-[#FF0000] scale-105' 
                : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover/fav:text-red-400'
            }`}
          ></i>
        </button>

        {/* Gambar Menu */}
        <img 
          src={product.image_url || '/Gambar_Login.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* --- BARIS IKON KARAKTERISTIK DINAMIS (Kanan Bawah Di Dalam Gambar) --- */}
        <div className="absolute bottom-4 right-5 flex gap-3 text-black bg-white/30 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm z-10 border border-white/20">
          
          {/* Kategori: Kopi atau Minuman Non-Kopi */}
          {(product.category?.toLowerCase() === 'coffee' || product.category?.toLowerCase() === 'non-coffee') && (
            <>
              <i className="fa-solid fa-mug-hot text-lg text-black/80" title="Menu Minuman"></i>
              <i 
                className={`fa-solid fa-snowflake text-lg transition-all duration-300 ${
                  hasIce ? 'text-blue-600 font-bold scale-100' : 'text-black/20 opacity-30 scale-90'
                }`} 
                title={hasIce ? "Tersedia Dingin" : "Tidak Tersedia Dingin"}
              ></i>
              <i 
                className={`fa-solid fa-fire-flame-simple text-lg transition-all duration-300 ${
                  hasHot ? 'text-orange-600 font-bold scale-100' : 'text-black/20 opacity-30 scale-90'
                }`} 
                title={hasHot ? "Tersedia Panas" : "Tidak Tersedia Panas"}
              ></i>
            </>
          )}

          {/* Kategori: Makanan Berat */}
          {product.category?.toLowerCase() === 'makanan' && (
            <>
              <i className="fa-solid fa-bowl-rice text-lg text-black/80" title="Makanan Utama"></i>
              <i 
                className={`fa-solid fa-pepper-hot text-lg transition-all duration-300 ${
                  isSpicy ? 'text-red-600 font-bold scale-100' : 'text-black/20 opacity-30 scale-90'
                }`} 
                title={isSpicy ? "Rasa Pedas" : "Tidak Pedas"}
              ></i>
              <i className="fa-solid fa-temperature-three-quarters text-lg text-orange-600" title="Disajikan Hangat"></i>
            </>
          )}

          {/* Kategori: Cemilan / Snack / Pastry */}
          {product.category?.toLowerCase() === 'cemilan' && (
            <>
              <i className="fa-solid fa-cookie-bite text-lg text-black/80" title="Cemilan"></i>
              <i 
                className={`fa-solid fa-candy-cane text-lg transition-all duration-300 ${
                  isSweet ? 'text-pink-500 font-bold scale-100' : 'text-black/20 opacity-30 scale-90'
                }`} 
                title={isSweet ? "Rasa Manis" : "Rasa Gurih / Asin"}
              ></i>
              <i className="fa-solid fa-cookie text-lg text-amber-700" title="Fresh Baked"></i>
            </>
          )}

        </div>
      </div>

      {/* --- BAGIAN 2: TEXT DETAILS (KATEGORI & NAMA) --- */}
      <div className="px-2 mb-4">
        <span className="text-gray-500 text-base font-medium capitalize tracking-wide block mb-0.5">
          {product.category || 'Menu'}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-tight tracking-tight line-clamp-1">
          {product.name || 'Nama Menu'}
        </h3>
      </div>

      {/* --- BAGIAN 3: PILIHAN UKURAN (BADGES) --- */}
      <div className="flex gap-2.5 px-2 mb-6">
        <span className="bg-[#FFC400] text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
          Normal
        </span>
        <span className="bg-[#FFC400] text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
          Besar
        </span>
      </div>

      {/* --- BAGIAN 4 & 5: HARGA & TOMBOL BELI (SEJAJAR KANAN-KIRI) --- */}
      <div className="flex justify-between items-center mt-auto pt-2 px-2">
        <div className="flex flex-col">
          <strong className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {formatRupiah(product.price) || 'Rp 0'}
          </strong>
        </div>

        <button 
          type="button" 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, selectedSize);
          }}
          className="bg-[#FF6E00] text-white px-8 py-3 rounded-full text-base font-bold hover:bg-[#E56200] transition-all duration-300 active:scale-95 shadow-md shadow-orange-600/20"
        >
          Beli
        </button>
      </div>

    </article>
  );
};

export default ProductCard;