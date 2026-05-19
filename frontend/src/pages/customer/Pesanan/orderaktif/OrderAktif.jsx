import React from 'react';
import { ChevronUp, Coffee, Check, Clock } from 'lucide-react';

// 🛠️ HELPER LOGIC: Sinkronisasi status string dari TiDB ke indeks Progress Bar (0 - 4)
const mapStatusToStep = (statusString) => {
  const status = String(statusString).toLowerCase();
  if (status === 'pending') return 0;     // Pemesan
  if (status === 'paid') return 1;        // Pembayaran
  if (status === 'processing') return 2;  // Proses (Sedang Diseduh)
  if (status === 'ready') return 3;       // Siap Diambil
  if (status === 'completed') return 4;   // Selesai
  return 0;
};

const OrderAktif = ({ orders = [] }) => {
  const steps = [
    { label: 'Pemesanan', desc: 'Pesanan masuk' },
    { label: 'Pembayaran', desc: 'Verifikasi bayar' },
    { label: 'Proses', desc: 'Sedang diseduh' },
    { label: 'Siap Diambil', desc: 'Ambil di bar' },
    { label: 'Selesai', desc: 'Nikmati kopimu' }
  ];

  return (
    <section className="mt-8 w-full px-1">
      {/* Inject Style Animasi Premium untuk Progress Efek Menyala & Gelombang */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 12px 2px rgba(251, 133, 0, 0.6); }
          50% { transform: scale(1.1); box-shadow: 0 0 20px 8px rgba(251, 133, 0, 0.3); }
        }
        @keyframes readyGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 12px 2px rgba(128, 185, 24, 0.6); }
          50% { transform: scale(1.1); box-shadow: 0 0 20px 8px rgba(128, 185, 24, 0.3); }
        }
        @keyframes waveMove {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
        .step-active-glow {
          animation: pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .step-ready-glow {
          animation: readyGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .line-wave-loading {
          background-image: linear-gradient(
            45deg, 
            rgba(255, 183, 3, 0.4) 25%, 
            transparent 25%, 
            transparent 50%, 
            rgba(255, 183, 3, 0.4) 50%, 
            rgba(255, 183, 3, 0.4) 75%, 
            transparent 75%, 
            transparent
          );
          background-size: 1rem 1rem;
          animation: waveMove 1.2s linear infinite;
        }
      `}</style>

      <h2 className="text-2xl font-black text-[#4A3728] mb-6 tracking-tight flex items-center gap-2">
        <Coffee className="w-6 h-6 text-[#FB8500]" /> Order Aktif
      </h2>
      
      <div className="space-y-6">
        {orders.map((order) => {
          // Menggunakan helper sinkronisasi status TiDB
          const currentStep = mapStatusToStep(order.status || order.currentStep);
          const progressPercent = (currentStep / (steps.length - 1)) * 100;

          return (
            <div key={order.id} className="bg-[#4A3728] rounded-[2.5rem] p-6 md:p-8 shadow-2xl text-white relative overflow-hidden border border-white/10">
              
              {/* Header Card: Detail Produk & Kuantitas */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#2B1E16] rounded-2xl overflow-hidden shadow-inner border border-white/15 flex-shrink-0">
                    <img 
                      src={order.image || "/placeholder-kopi.jpg"} 
                      alt={order.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest bg-[#FB8500]/20 text-[#FFB703] px-2.5 py-1 rounded-md border border-[#FB8500]/30">
                      {order.category_label || 'Kopi'}
                    </span>
                    <h3 className="text-xl font-black leading-tight mt-1.5 tracking-tight text-[#FFF4EA]">{order.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 bg-[#FFB703] text-[#4A3728] text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm uppercase">
                        <Clock className="w-3 h-3" /> {order.statusLabel || order.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Badge Jumlah & Harga */}
                <div className="flex sm:flex-col justify-between sm:justify-start w-full sm:w-auto items-center sm:items-end border-t border-white/10 sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <div className="bg-[#FB8500] px-4 py-1 rounded-xl font-black text-xs shadow-md uppercase tracking-wider text-white">
                    {order.quantity || 1} Pcs
                  </div>
                  <p className="text-2xl font-black tracking-tight mt-1.5 text-[#FFB703]">
                    Rp {(order.price || 0).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Progress Bar Section (Box Diperbaiki Menjadi Lebih Kontras & Deep) */}
              <div className="relative w-full mb-6 bg-[#3D2C1E] rounded-3xl p-5 border border-white/5 shadow-inner">
                
                {/* LAYOUT DESKTOP: Garis Horizontal Jalan */}
                <div className="hidden md:block absolute top-[2.1rem] left-12 right-12 h-2 bg-[#2B1E16] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#80B918] via-[#FFB703] to-[#FB8500] rounded-full transition-all duration-1000 ease-out line-wave-loading shadow-[0_0_14px_rgba(251,133,0,0.8)]"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {/* CONTAINER UTAMA STATUS */}
                <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-2 relative z-10">
                  {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    // Mengatur style dinamis berdasarkan status per step
                    let badgeStyles = "bg-[#654E3C] text-[#D4C3B3] border-[#3D2C1E]";
                    if (isCompleted) {
                      badgeStyles = "bg-[#80B918] text-white border-[#3D2C1E] shadow-lg shadow-[#80B918]/30";
                    } else if (isCurrent) {
                      badgeStyles = currentStep === 3 
                        ? "bg-[#80B918] text-white border-[#3D2C1E] step-ready-glow"
                        : "bg-[#FB8500] text-white border-[#3D2C1E] step-active-glow";
                    }

                    return (
                      <div key={index} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 md:w-24 group">
                        
                        {/* Bulatan Node Indikator */}
                        <div className={`w-8 h-8 rounded-full border-4 z-10 flex items-center justify-center transition-all duration-500 text-xs font-black ${badgeStyles}`}>
                          {isCompleted ? <Check className="w-4 h-4 stroke-" /> : index + 1}
                        </div>
                        
                        {/* Teks Deskripsi Status */}
                        <div className="text-left md:text-center flex-1 md:flex-none">
                          <p className={`text-xs font-black tracking-wide transition-all duration-300 ${isCurrent ? 'text-[#FFB703] scale-105' : isCompleted ? 'text-[#EFF6E0]' : 'text-[#A08A75]'}`}>
                            {step.label}
                          </p>
                          <p className={`text-[10px] font-bold leading-tight mt-0.5 ${isCurrent ? 'text-white/80' : 'text-white/40'}`}>
                            {step.desc}
                          </p>
                        </div>

                        {/* LAYOUT MOBILE: Garis Hubung Vertikal */}
                        {index < steps.length - 1 && (
                          <div className="md:hidden absolute left-4 ml-[-1px] w-[2px] h-8 bg-[#2B1E16] mt-8 -z-10">
                            <div className={`w-full bg-gradient-to-b from-[#80B918] to-[#FB8500] transition-all duration-500 ${index < currentStep ? 'h-full' : 'h-0'}`}></div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Card: Pesan Pendukung */}
              <div className="flex flex-col items-center relative z-10 pt-1">
                <p className="text-xs font-bold text-[#FFE1A8] text-center mb-1.5 tracking-wide">
                  {currentStep === 2 && "Sabar yaaa!! Pesanan kamu sedang diracik dengan cinta oleh barista ☕"}
                  {currentStep === 3 && "Hore! Kopimu sudah matang, yuk langsung ambil di meja kasir 🏃💨"}
                  {currentStep < 2 && "Pesananmu sedang mengantre di sistem kasir pintar..."}
                  {currentStep === 4 && "Pesanan selesai. Terima kasih sudah ngopi di Warung Kopi! 🎉"}
                </p>
                {currentStep < 4 && <ChevronUp className="w-5 h-5 animate-bounce text-[#FFB703]" />}
                 
                <div className="w-full border-t border-white/10 mt-4 pt-3 flex flex-row justify-between items-center text-[10px] text-white/50 font-semibold tracking-wider">
                  <div>
                    <span className="block text-[8px] uppercase tracking-widest opacity-60">Waktu Order</span>
                    <span className="font-bold text-[#FFF4EA] text-[11px]">{order.time || '15:28 PM'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] uppercase tracking-widest opacity-60">Tanggal</span>
                    <span className="font-bold text-[#FFF4EA] text-[11px]">{order.date || 'Jumat, 15-Mei-2026'}</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OrderAktif;