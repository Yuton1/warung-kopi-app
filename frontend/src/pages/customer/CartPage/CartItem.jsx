import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatRupiah';

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  // Ambil harga aman
  const itemPrice = item.price ?? item.unitPrice ?? 0;
  const subtotal = itemPrice * (item.qty ?? 1);

  return (
    <div className="group relative w-full bg-[#fffaf0] p-4 sm:p-5 rounded-[2rem] shadow-[0_4px_20px_rgba(30,20,15,0.03)] hover:shadow-[0_12px_30px_rgba(30,20,15,0.08)] hover:-translate-y-0.5 border border-[#6F4E37]/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden">
      
      {/* Sisi Kiri: Gambar dan Detail Informasi */}
      <div className="flex items-center gap-4 sm:gap-5 min-w-0">
        {/* Kontainer Gambar dengan Efek Zoom on Hover */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1e140f]/5 rounded-2xl overflow-hidden flex-none shadow-inner border border-black/[0.03] relative">
          <img 
            src={item.imageUrl || item.image || '/Logo_Warkop_Nav.png'} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        
        {/* Info Text Produk */}
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#ff7b00] mb-0.5">
            {item.category || 'COFFEE'}
          </p>
          <h3 className="text-base sm:text-lg font-black text-[#241710] leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-[#6F4E37] font-extrabold text-xs sm:text-sm mt-0.5">
            {formatRupiah(itemPrice)} 
            <span className="text-[#241710]/40 font-medium text-xs"> / pcs</span>
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Kontrol Jumlah, Subtotal, dan Hapus (Responsif HP & PC) */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t border-[#1e140f]/5 sm:border-t-0 pt-3 sm:pt-0">
        
        {/* Info Subtotal Spesifik Item (Membantu UX User) */}
        <div className="hidden lg:flex flex-col text-right min-w-[100px]">
          <span className="text-[9px] uppercase tracking-wider text-[#241710]/40 font-bold">Subtotal</span>
          <p className="text-base font-black text-[#241710] tracking-tight">
            {formatRupiah(subtotal)}
          </p>
        </div>

        {/* Tombol Stepper Quantity (+ / -) */}
        <div className="flex items-center bg-[#241710]/5 rounded-2xl p-1 border border-[#241710]/5 shadow-inner">
          <button 
            onClick={() => onUpdateQty(item.id, -1)}
            disabled={item.qty <= 1}
            className="p-1.5 sm:p-2 bg-white hover:bg-[#241710] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#241710] rounded-xl text-[#241710] hover:text-white shadow-sm hover:shadow active:scale-90 transition-all duration-200"
            title="Kurangi jumlah"
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          
          {/* Animasi angka berdenyut halus saat nilainya berubah */}
          <span className="px-3 sm:px-4 font-black text-[#241710] text-sm sm:text-base min-w-[24px] text-center select-none animate-fadeIn">
            {item.qty}
          </span>
          
          <button 
            onClick={() => onUpdateQty(item.id, 1)}
            className="p-1.5 sm:p-2 bg-white hover:bg-[#241710] rounded-xl text-[#241710] hover:text-white shadow-sm hover:shadow active:scale-90 transition-all duration-200"
            title="Tambah jumlah"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        
        {/* Tombol Trash dengan Mikro-Interaksi Gemetar (Shake) */}
        <button 
          onClick={() => onRemove(item.id)}
          className="group/trash relative text-rose-500/70 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 p-2.5 sm:p-3 rounded-2xl transition-all duration-300 active:scale-90 flex-none overflow-hidden"
          title="Hapus item"
        >
          {/* Gaya Animasi CSS Murni Lucide Icon */}
          <style>{`
            .group\\/trash:hover .trash-icon {
              animation: trash-shake 0.3s ease-in-out infinite alternate;
            }
            @keyframes trash-shake {
              0% { transform: rotate(-6deg); }
              100% { transform: rotate(6deg); }
            }
          `}</style>
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 trash-icon transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default CartItem;