import { useMemo, useState } from 'react'
import { formatRupiah } from '../utils/formatRupiah'

// Fallback jika data size dari database belum ada
const FALLBACK_SIZES = [
  { label: 'Tall', factor: 1, note: '250 ml' },
  { label: 'Grande', factor: 1.2, note: '350 ml' },
  { label: 'Venti', factor: 1.5, note: '450 ml' }
]

const ProductCard = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onAddToGroup,
}) => {
  // Mengambil data size dari produk atau fallback
  const sizes = product.sizes?.length ? product.sizes : FALLBACK_SIZES
  
  // Default selection (Grande jika ada, atau index ke-1)
  const [selectedSize, setSelectedSize] = useState(sizes[Math.min(1, sizes.length - 1)])

  const activeSize = sizes.find((item) => item.label === selectedSize?.label) || sizes[0]

  // Hitung harga berdasarkan factor ukuran
  const price = useMemo(() => {
    const basePrice = Number(product.price) || 0
    const factor = activeSize?.factor ?? 1
    return Math.round(basePrice * factor)
  }, [activeSize, product.price])

  const points = product.points ?? product.base_points ?? '0'

  return (
    <article className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col w-full border border-gray-100">
      
      {/* --- BAGIAN ATAS: Gradient & Initials --- */}
      <div className="relative h-36 bg-gradient-to-br from-[#5D4037] to-[#2B1B17] p-6 flex items-start justify-between">
        {/* Lingkaran Cahaya Dekat Favorit (Opsional untuk estetika) */}
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        {/* Chip Inisial */}
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
          <span className="text-white text-2xl font-serif font-bold tracking-tighter">
            {product.initials || 'WK'}
          </span>
        </div>

        {/* Tombol Favorit */}
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all shadow-sm ${
            isFavorite 
            ? 'bg-orange-500 text-white border-orange-400' 
            : 'bg-white/20 text-white border-white/20 hover:bg-white/30'
          }`}
        >
          Favorit
        </button>
      </div>

      {/* --- BAGIAN BODY --- */}
      <div className="p-6 flex flex-col gap-4">
        
        {/* Meta: Kategori & Badge Status */}
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-black text-[#5D4037] uppercase tracking-[0.2em]">
            {product.category || 'KOPI'}
          </span>
          <span className="text-[11px] font-black text-[#5D4037] uppercase tracking-[0.2em]">
            {product.badge || 'FRESH'}
          </span>
        </div>

        {/* Judul & Deskripsi */}
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {product.description || 'Deskripsi produk kopi yang nikmat dan segar.'}
          </p>
        </div>

        {/* Pemilihan Ukuran (Pills) */}
        <div className="flex gap-2 py-2">
          {sizes.map((size) => {
            const isActive = activeSize.label === size.label
            return (
              <button
                key={size.label}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`flex-1 flex flex-col items-center justify-center py-2 rounded-[1.25rem] border-2 transition-all ${
                  isActive 
                  ? 'border-[#5D4037] bg-white ring-4 ring-[#5D4037]/5' 
                  : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <span className={`text-sm font-bold ${isActive ? 'text-black' : 'text-gray-500'}`}>
                  {size.label}
                </span>
                <small className="text-[10px] opacity-70">{size.note}</small>
              </button>
            )
          })}
        </div>

        {/* Harga & Poin */}
        <div className="flex justify-between items-end mt-2">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Harga</p>
            <strong className="text-xl font-extrabold text-black tracking-tight">
              {formatRupiah(price)}
            </strong>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Poin</p>
            <strong className="text-xl font-extrabold text-black">
              {points}
            </strong>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-5 gap-3 mt-2">
          <button 
            type="button" 
            className="col-span-3 bg-[#1A120B] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-black/20 hover:bg-black transition-transform active:scale-95"
            onClick={() => onAddToCart(product, activeSize, price)}
          >
            Tambah ke Keranjang
          </button>
          <button 
            type="button" 
            className="col-span-2 bg-gray-100 text-[#1A120B] py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-transform active:scale-95"
            onClick={() => onAddToGroup(product, activeSize, price)}
          >
            Tambah ke Grup
          </button>
        </div>

      </div>
    </article>
  )
}

export default ProductCard
