import React from 'react';
import { formatRupiah } from '../../../utils/formatRupiah';

const AnalyticsDashboard = ({ monthlySpend, favoriteCoffee, planStatus, subscriptionData = { remaining: 3, total: 5 } }) => {
  const percentage = (subscriptionData.remaining / subscriptionData.total) * 100;

  return (
    <article className="w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
      {/* Background Element */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50 rounded-full -mr-20 -mt-20 opacity-50"></div>

      <div className="relative z-10">
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-[#1A120B]">Analytics Dashboard</h2>
          <p className="text-[#4A3728] font-medium">Ringkasan kebiasaan ngopi kamu bulan ini</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1: Spending */}
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-orange-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Total Belanja</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1A120B]">{formatRupiah(monthlySpend)}</span>
              <span className="text-xs font-bold text-green-600">↑ 12%</span>
            </div>
          </div>

          {/* Stat 2: Favorite */}
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-orange-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1A120B] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
              {favoriteCoffee.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Menu Favorit</span>
              <span className="text-lg font-black text-[#4A3728]">{favoriteCoffee}</span>
            </div>
          </div>

          {/* Stat 3: Subscription Status & Quota */}
          <div className="bg-[#1A120B] p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-2">Status: {planStatus}</span>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xl font-bold text-white">{subscriptionData.remaining} / {subscriptionData.total} Cup</span>
                <span className="text-[10px] text-gray-400 font-bold">Sisa Kuota</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 flex justify-end">
          <button className="text-sm font-black text-[#1A120B] hover:text-orange-600 transition-colors flex items-center gap-2 group">
            LIHAT DETAIL ANALYTICS 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </footer>
      </div>
    </article>
  );
};

export default AnalyticsDashboard;