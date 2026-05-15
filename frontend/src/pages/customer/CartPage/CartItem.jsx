import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatRupiah';

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm flex items-center justify-between border border-[#B08968]/10 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-5">
        {/* Gambar Produk */}
        <div className="w-20 h-20 bg-[#F5EBE0] rounded-2xl overflow-hidden shadow-inner">
          <img src={item.imageUrl || item.image || '/Logo_Warkop_Nav.png'} alt={item.name} className="w-full h-full object-cover" />
        </div>
        {/* Info Produk */}
        <div>
          <h3 className="text-lg font-black text-[#4A3728] leading-tight">{item.name}</h3>
          <p className="text-[#B08968] font-bold text-sm">{formatRupiah(item.price ?? item.unitPrice ?? 0)}</p>
        </div>
      </div>

      {/* Kontrol Jumlah & Hapus */}
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-[#F5EBE0] rounded-xl p-1">
          <button 
            onClick={() => onUpdateQty(item.id, -1)}
            className="p-2 hover:bg-white rounded-lg transition-all text-[#4A3728]"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 font-black text-[#4A3728]">{item.qty}</span>
          <button 
            onClick={() => onUpdateQty(item.id, 1)}
            className="p-2 hover:bg-white rounded-lg transition-all text-[#4A3728]"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          onClick={() => onRemove(item.id)}
          className="text-red-400 hover:text-red-600 transition-colors p-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
