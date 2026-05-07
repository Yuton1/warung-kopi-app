import React from 'react';
import { ChevronUp } from 'lucide-react';

const OrderAktif = ({ orders }) => {
  // Definisi tahapan pesanan untuk progress bar
  const steps = [
    { label: 'Pemesanan' },
    { label: 'Pembayaran' },
    { label: 'Proses' },
    { label: 'Siap Diambil' },
    { label: 'Selesai' }
  ];

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-[#4A3728] mb-4">Order Aktif</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-[#B08968] rounded-[2.5rem] p-7 shadow-xl text-white relative overflow-hidden">
            
            {/* Header Card: Info Produk & Harga */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-4">
                {/* Gambar Produk */}
                <div className="w-16 h-16 bg-[#6F4E37] rounded-2xl overflow-hidden shadow-inner">
                  <img 
                    src={order.image || "/placeholder-kopi.jpg"} 
                    alt={order.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                {/* Detail Nama & Status */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-80 font-medium">Kopi</p>
                  <h3 className="text-lg font-extrabold leading-tight">{order.name}</h3>
                  <span className="inline-block bg-[#FFB703] text-[#4A3728] text-[9px] font-black px-3 py-0.5 rounded-full mt-1">
                    {order.statusLabel}
                  </span>
                </div>
              </div>
              
              {/* Badge Jumlah & Harga */}
              <div className="text-right">
                <div className="bg-[#FB8500] px-5 py-1 rounded-xl font-black inline-block text-sm mb-1 shadow-md">
                  {order.quantity}
                </div>
                <p className="text-lg font-black tracking-tight">
                  Rp {order.price?.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Progress Bar Section */}
            <div className="relative w-full px-1 mb-10">
              {/* Garis Dasar (Background) */}
              <div className="absolute top-2.5 left-0 w-full h-1.5 bg-[#4A3728]/30 rounded-full"></div>
              
              {/* Garis Progress yang Berjalan */}
              <div 
                className="absolute top-2.5 left-0 h-1.5 bg-[#FB8500] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(251,133,0,0.5)]"
                style={{ width: `${(order.currentStep / (steps.length - 1)) * 100}%` }}
              ></div>

              {/* Titik-titik Status (Dots) */}
              <div className="relative flex justify-between items-start">
                {steps.map((step, index) => {
                  const isCompleted = index < order.currentStep;
                  const isCurrent = index === order.currentStep;

                  return (
                    <div key={index} className="flex flex-col items-center w-12">
                      <div className={`w-5 h-5 rounded-full border-2 border-[#4A3728] z-10 transition-colors duration-500
                        ${isCompleted ? 'bg-[#80B918] border-[#80B918]' : isCurrent ? 'bg-[#FFB703]' : 'bg-[#E6CCB2]'}`}>
                      </div>
                      <p className={`text-[9px] mt-2 font-bold text-center leading-none 
                        ${isCurrent ? 'opacity-100 scale-110' : 'opacity-70'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Card: Pesan Motivasi & Metadata */}
            <div className="flex flex-col items-center">
               <p className="text-[11px] italic font-medium opacity-90 mb-2">
                 Sabar yaaa!! pesanan kamu masih di proses oleh baristaa
               </p>
               <ChevronUp className="w-5 h-5 animate-bounce" />
               
               <div className="w-full border-t border-white/20 mt-4 pt-3 flex justify-between items-end opacity-60">
                  <div className="text-[9px] leading-tight">
                    <p className="uppercase tracking-tighter">Informasi Pesanan</p>
                    <p className="font-black text-[10px] mt-0.5">{order.time}</p>
                    <p>{order.date}</p>
                  </div>
               </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderAktif;