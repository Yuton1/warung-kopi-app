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
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251, 133, 0, 0.7); }
          50% { transform: scale(1.12); box-shadow: 0 0 14px 6px rgba(251, 133, 0, 0); }
        }
        @keyframes waveMove {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
        .step-active-glow {
          animation: pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .line-wave-loading {
          background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
          background-size: 1rem 1rem;
          animation: waveMove 1s linear infinite;
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
            <div key={order.id} className="bg-[#B08968] rounded-[2.5rem] p-6 md:p-8 shadow-xl text-white relative overflow-hidden transition-all duration-300 hover:shadow-2xl/30 border border-white/10">
              
              {/* Header Card: Detail Produk & Kuantitas */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 relative z-10">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#6F4E37] rounded-2xl overflow-hidden shadow-inner border border-white/10 flex-shrink-0">
                    <img 
                      src={order.image || "/placeholder-kopi.jpg"} 
                      alt={order.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest bg-black/10 px-2 py-0.5 rounded-md text-[#E6CCB2]">
                      {order.category_label || 'Kopi'}
                    </span>
                    <h3 className="text-xl font-black leading-tight mt-1 tracking-tight">{order.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 bg-[#FFB703] text-[#4A3728] text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm uppercase">
                        <Clock className="w-3 h-3" /> {order.statusLabel || order.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Badge Jumlah & Harga */}
                <div className="flex sm:flex-col justify-between sm:justify-start w-full sm:w-auto items-center sm:items-end border-t border-white/10 sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <div className="bg-[#FB8500] px-4 py-1 rounded-xl font-black text-xs shadow-md uppercase tracking-wider">
                    {order.quantity || 1} Pcs
                  </div>
                  <p className="text-xl font-black tracking-tight mt-1.5 text-white">
                    Rp {(order.price || 0).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Progress Bar Section (Responsive Grid & Flex-Line) */}
              <div className="relative w-full mb-8 bg-black/10 rounded-3xl p-5 border border-white/5">
                
                {/* LAYOUT DESKTOP: Garis Horizontal Jalan (Muncul di layar md ke atas) */}
                <div className="hidden md:block absolute top-[2.1rem] left-12 right-12 h-1.5 bg-[#4A3728]/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#80B918] to-[#FB8500] rounded-full transition-all duration-1000 ease-out line-wave-loading shadow-[0_0_12px_rgba(251,133,0,0.6)]"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {/* CONTAINER UTAMA STATUS: Fleksibel mengikuti resolusi layar */}
                <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-2 relative z-10">
                  {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <div key={index} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 md:w-24 group">
                        
                        {/* Bulatan Node Indikator */}
                        <div className={`w-8 h-8 rounded-full border-4 border-[#B08968] z-10 flex items-center justify-center transition-all duration-500 text-xs font-bold
                          ${isCompleted 
                            ? 'bg-[#80B918] text-white shadow-lg shadow-[#80B918]/20' 
                            : isCurrent 
                              ? 'bg-[#FB8500] text-white step-active-glow' 
                              : 'bg-[#E6CCB2] text-[#4A3728]'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5 stroke-" /> : index + 1}
                        </div>
                        
                        {/* Teks Deskripsi Status */}
                        <div className="text-left md:text-center flex-1 md:flex-none">
                          <p className={`text-xs font-black transition-all duration-300 ${isCurrent ? 'text-[#FFB703] scale-105' : 'text-white/90'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-white/50 font-medium md:hidden leading-tight mt-0.5">
                            {step.desc}
                          </p>
                        </div>

                        {/* LAYOUT MOBILE: Garis Hubung Vertikal Semu antar item */}
                        {index < steps.length - 1 && (
                          <div className="md:hidden absolute left-4 ml-[-1px] w-[2px] h-8 bg-white/20 mt-8 -z-10">
                            <div className={`w-full h-full bg-[#FB8500] transition-all duration-500 ${index < currentStep ? 'h-full' : 'h-0'}`}></div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Card: Pesan Pendukung & Meta Metadata */}
              <div className="flex flex-col items-center relative z-10 pt-2">
                <p className="text-xs italic font-semibold text-[#FFE1A8] text-center mb-1">
                  {currentStep === 2 && "Sabar yaaa!! Pesanan kamu sedang diracik dengan cinta oleh barista ☕"}
                  {currentStep === 3 && "Hore! Kopimu sudah matang, yuk langsung ambil di meja kasir 🏃💨"}
                  {currentStep < 2 && "Pesananmu sedang mengantre di sistem kasir pintar..."}
                  {currentStep === 4 && "Pesanan selesai. Terima kasih sudah ngopi di Warung Kopi! 🎉"}
                </p>
                {currentStep < 4 && <ChevronUp className="w-5 h-5 animate-bounce text-[#FFB703]" />}
                 
                <div className="w-full border-t border-white/10 mt-5 pt-3 flex flex-row justify-between items-center text-[10px] text-white/60 font-medium">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider opacity-60">Waktu Order</span>
                    <span className="font-bold text-white text-[11px]">{order.time || '15:28 PM'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] uppercase tracking-wider opacity-60">Tanggal</span>
                    <span className="font-bold text-white text-[11px]">{order.date || 'Jumat, 15-Mei-2026'}</span>
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