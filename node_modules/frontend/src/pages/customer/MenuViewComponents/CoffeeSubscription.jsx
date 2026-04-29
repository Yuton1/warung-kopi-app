import React from 'react';
import { formatRupiah } from '../../../utils/formatRupiah';

const CoffeeSubscription = ({ plans, activeId, onActivate }) => {
  return (
    <article className="w-full bg-[#1A120B] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.03] rounded-full -mr-20 -mt-20"></div>
      
      <header className="relative z-10 mb-10">
        <span className="text-orange-400 font-black uppercase tracking-widest text-xs">Premium Membership</span>
        <h2 className="text-4xl font-bold text-white mt-2">Coffee Subscription</h2>
        <p className="text-gray-400 mt-2 max-w-xl">
          Pilih paket yang sesuai dengan gaya hidupmu. Mulai dari paket harian hingga berbagi meja dengan komunitas.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => onActivate(plan.id)}
            className={`cursor-pointer group relative flex flex-col justify-between p-8 rounded-[2rem] transition-all duration-500 border-2 ${
              activeId === plan.id 
              ? 'border-orange-500 scale-[1.03] shadow-orange-900/20 shadow-2xl' 
              : 'border-white/5 hover:border-white/20'
            } ${plan.accent}`}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 rounded-[1.9rem]"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-3">{plan.name}</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                {plan.description}
              </p>
              <div className="inline-block bg-black/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter">
                {plan.quota}
              </div>
            </div>

            <div className="relative z-10 mt-10 flex flex-col gap-4">
              <div className="bg-white/95 backdrop-blur-xl py-4 rounded-2xl text-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-[#1A120B] font-black text-xl">
                  {formatRupiah(plan.price)}
                </span>
              </div>
              {activeId === plan.id && (
                <div className="text-center text-white text-[10px] font-bold animate-pulse">
                  ✓ PAKET AKTIF
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-10 text-center relative z-10">
        <p className="text-gray-500 text-xs italic">
          * Syarat dan ketentuan berlaku. Kuota cup diperbarui setiap periode penagihan.
        </p>
      </footer>
    </article>
  );
};

export default CoffeeSubscription;