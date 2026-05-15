import React from 'react';
import { ShoppingBag } from 'lucide-react';

const OrderSummary = ({ subtotal, tax, total, onCheckout = () => {} }) => {
  return (
    <div className="bg-[#4A3728] text-white p-8 rounded-[2.5rem] shadow-xl sticky top-10 border-b-8 border-[#2D1E14]">
      <h3 className="text-xl font-black mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Ringkasan</h3>
      
      <div className="space-y-4 mb-8">
        <div className="flex justify-between opacity-80 font-medium">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between opacity-80 font-medium">
          <span>Pajak (10%)</span>
          <span>Rp {tax.toLocaleString('id-ID')}</span>
        </div>
        <div className="h-[1px] bg-white/20 my-2"></div>
        <div className="flex justify-between text-xl font-black">
          <span>Total</span>
          <span className="text-[#FFB703]">Rp {total.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="w-full bg-[#FB8500] hover:bg-[#ff9500] text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 group"
      >
        Checkout Sekarang 
        <ShoppingBag className="w-5 h-5 group-hover:animate-bounce" />
      </button>
    </div>
  );
};

export default OrderSummary;
