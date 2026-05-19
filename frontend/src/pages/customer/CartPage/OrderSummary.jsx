import React from 'react';
import { ShoppingBag } from 'lucide-react';

const OrderSummary = ({ subtotal = 0, tax = 0, total = 0, onCheckout = () => {} }) => {
  return (
    <div className="bg-[#241710] text-white p-6 sm:p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(30,20,15,0.15)] border border-white/[0.03] border-b-[10px] border-[#1c120c] sticky top-6 md:top-10 transition-all duration-300">
      
      {/* Header Ringkasan */}
      <h3 className="text-lg sm:text-xl font-black mb-6 uppercase tracking-widest border-b border-white/10 pb-4 text-[#fffaf0] flex items-center justify-between">
        <span>Ringkasan</span>
        <span className="text-[10px] bg-white/10 text-white/60 px-3 py-1 rounded-full font-bold normal-case tracking-normal">
          Billing Detail
        </span>
      </h3>
      
      {/* Rincian Harga */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-sm opacity-80 font-bold tracking-wide hover:opacity-100 transition-opacity">
          <span className="text-white/70">Subtotal</span>
          <span className="font-extrabold text-[#fffaf0]">
            Rp {subtotal.toLocaleString('id-ID')}
          </span>
        </div>
        
        <div className="flex justify-between text-sm opacity-80 font-bold tracking-wide hover:opacity-100 transition-opacity">
          <span className="text-white/70">Pajak (10%)</span>
          <span className="font-extrabold text-[#fffaf0]">
            Rp {tax.toLocaleString('id-ID')}
          </span>
        </div>
        
        {/* Pembatas / Divider dengan efek gradasi neon tipis */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
        
        {/* Total Price (Highlight) */}
        <div className="flex justify-between items-center text-xl font-black group/total">
          <span className="tracking-tight text-white/90">Total Akhir</span>
          <span className="text-[#ffd60a] text-2xl tracking-tight transition-all duration-300 group-hover/total:scale-105 drop-shadow-[0_2px_10px_rgba(255,214,10,0.2)]">
            Rp {total.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Tombol Checkout Premium dengan Mikro-Interaksi */}
      <button
        type="button"
        onClick={onCheckout}
        disabled={total === 0}
        className="w-full relative overflow-hidden bg-gradient-to-r from-[#ff7b00] to-[#ff9500] hover:from-[#ff9500] hover:to-[#ffaa00] disabled:from-gray-700 disabled:to-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(255,123,0,0.35)] hover:shadow-[0_8px_25px_rgba(255,123,0,0.5)] flex items-center justify-center gap-3 active:scale-[0.97] border-b-4 border-[#cc6200] disabled:border-transparent active:border-b-0 active:translate-y-[4px] group"
      >
        {/* Efek Kilatan Cahaya (Shine Effect) saat Hover */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />

        <style>{`
          @keyframes shine {
            100% { transform: translateX(100%); }
          }
          .group:hover .bag-bounce {
            animation: bag-jump 0.6s ease-in-out infinite alternate;
          }
          @keyframes bag-jump {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-4px) scale(1.08); }
          }
          .animate-shine { animation: shine 0.8s ease-out; }
        `}</style>

        <span className="tracking-wider drop-shadow-sm">Checkout Sekarang</span>
        <ShoppingBag className="w-5 h-5 bag-bounce transition-transform drop-shadow-sm" />
      </button>

      {/* Info Tambahan Estetik di Bawah Tombol */}
      <p className="text-center text-[10px] text-white/30 font-bold uppercase tracking-widest mt-4">
        🔒 Secure checkout via TiDB System
      </p>

    </div>
  );
};

export default OrderSummary;