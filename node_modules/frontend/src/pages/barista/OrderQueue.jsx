// C:\laragon\www\WarungKopi\frontend\src\pages\barista\OrderQueue.jsx
import Sidebar from '../../components/Sidebar/Sidebar';
import { Play, CheckCircle, Clock } from 'lucide-react';

const OrderQueue = () => {
  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <Sidebar role="barista" />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Order Queue</h1>
          <p className="text-gray-500">Kelola pesanan yang masuk secara real-time.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pesanan Masuk (Pending) */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-2 font-bold text-[#e39b4f]">
              <Clock size={20} /> Pesanan Baru
            </h2>
            <div className="bg-white p-6 rounded-[2rem] border border-orange-100 shadow-sm flex justify-between items-center">
               <div>
                  <h4 className="font-bold text-[#2c1b0e]">Order #012 - Americano</h4>
                  <p className="text-sm text-gray-500 italic">"Hot, no sugar"</p>
               </div>
               <button className="bg-[#2c1b0e] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                 <Play size={16} /> Proses
               </button>
            </div>
          </section>

          {/* Pesanan Siap (Ready) */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-2 font-bold text-green-600">
              <CheckCircle size={20} /> Siap Diambil
            </h2>
            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex justify-between items-center opacity-60">
               <div>
                  <h4 className="font-bold text-green-900">Order #011 - Latte</h4>
                  <p className="text-sm text-green-700">Dine in - Table 04</p>
               </div>
               <span className="text-green-600 font-bold">READY</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OrderQueue;