import { useMemo } from 'react'
import { Check, Home, Package, Truck, Coffee, ArrowRight, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const ShippingAddress = ({ order }) => {
  // Ambil status mentah dari database orders (contoh: 'pending', 'preparing', 'shipping', 'delivered')
  const currentStatus = String(order?.status ?? 'pending').toLowerCase()

  // Sinkronisasi status database ke tahapan stepper UI/UX secara dinamis
  const steps = useMemo(() => {
    const statusLevels = {
      pending: 0,     // Baru dipesan / Confirmed
      preparing: 1,   // Sedang diracik barista
      shipping: 2,    // Sedang diantar kurir
      delivered: 3    // Sampai di tujuan
    }

    const activeLevel = statusLevels[currentStatus] ?? 0

    return [
      { 
        label: 'Pesanan Diterima', 
        desc: 'Barista mengonfirmasi pesanan Anda.', 
        icon: Check, 
        state: activeLevel > 0 ? 'completed' : activeLevel === 0 ? 'active' : 'pending' 
      },
      { 
        label: 'Sedang Disiapkan', 
        desc: 'Kopi Anda sedang diracik dengan sepenuh hati.', 
        icon: Coffee, 
        state: activeLevel > 1 ? 'completed' : activeLevel === 1 ? 'active' : 'pending' 
      },
      { 
        label: 'Dalam Perjalanan', 
        desc: 'Kurir sedang mengarah ke lokasi Anda.', 
        icon: Truck, 
        state: activeLevel > 2 ? 'completed' : activeLevel === 2 ? 'active' : 'pending' 
      },
      { 
        label: 'Sampai Tujuan', 
        desc: 'Kopi hangat siap dinikmati!', 
        icon: Home, 
        state: activeLevel === 3 ? 'completed' : 'pending' 
      },
    ]
  }, [currentStatus])

  // Fallback State jika tidak ada transaksi atau pengiriman yang berjalan
  if (!order || Object.keys(order).length === 0) {
    return (
      <article className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between h-full font-['Fredoka']">
        <div className="text-center py-10 my-auto flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#fcf8f4] border border-[#f0e2d5] flex items-center justify-center text-[#b08968] mb-4">
            <Truck className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-[#2c1b0e]">Tidak Ada Pengiriman Aktif</h4>
          <p className="text-sm text-gray-400 max-w-xs mt-1 mb-6">
            Semua pesanan Anda telah selesai diantar. Yuk, pesan kopi favoritmu lagi!
          </p>
          <Link to="/menu" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4a2c11] text-white rounded-xl text-sm font-medium hover:bg-[#3d2510] transition-colors">
            Pesan Sekarang <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm font-['Fredoka']">
      
      {/* HEADER KARTU */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fcf8f4] border border-[#f0e2d5] text-[#4b3729]">
            <Package className="h-5 w-5 text-[#b08968]" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-[#2c1b0e] mb-0.5">Pelacakan Pengiriman</h3>
            <p className="text-xs text-gray-400">Pantau perjalanan kopi hangatmu secara berkala.</p>
          </div>
        </div>
        
        <Link 
          to="/pesanan" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#b08968] bg-[#fcf8f4] hover:bg-[#f7ece1] border border-[#f0e2d5]/60 px-4 py-2.5 rounded-xl self-start sm:self-auto transition-all"
        >
          Lihat Riwayat Ringkas
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* GRID UTAMA RESPONSIF */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        
        {/* PANEL KIRI: DETAIL ALAMAT (Tema Dark Wood Premium) */}
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#3d2510] to-[#5b3927] p-6 text-[#fff7ef] shadow-md flex flex-col justify-between relative overflow-hidden">
          {/* Aksen Background Lingkaran */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              ID Pesanan #{order.id}
            </div>

            <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">Lokasi Tujuan Antar</p>
            <h4 className="mt-1 text-2xl font-bold tracking-wide text-white truncate">{order.recipient || 'Pelanggan'}</h4>

            <div className="mt-5 rounded-2xl bg-black/15 border border-white/5 p-4 backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-white/90 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
                <span>{order.address || 'Alamat belum diatur.'}</span>
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm text-white/80">
                <Phone className="h-4 w-4 text-amber-300 shrink-0" />
                <span>{order.phone || '-'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-white/40 flex justify-between items-center relative z-10">
            <span>Metode: Delivery Kurir Toko</span>
            <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
              {currentStatus}
            </span>
          </div>
        </div>

        {/* PANEL KANAN: STEPPER TRACKING (Tema Light Cream) */}
        <div className="rounded-[2.5rem] bg-[#fcf8f4] border border-[#f0e2d5]/40 p-6 flex flex-col justify-center">
          <div className="space-y-6 relative before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e6d5c5]">
            
            {steps.map((step, idx) => {
              const isCompleted = step.state === 'completed'
              const isActive = step.state === 'active'
              const StepIcon = step.icon

              return (
                <div key={idx} className="flex items-start gap-4 relative z-10 group">
                  {/* Ikon Lingkaran Indikator */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'border-[#88b65f] bg-[#88b65f] text-white shadow-sm'
                        : isActive
                          ? 'border-[#b08968] bg-[#4a2c11] text-white shadow-md scale-105'
                          : 'border-[#e6d5c5] bg-white text-gray-300'
                    }`}
                  >
                    <StepIcon className={`h-4 w-4 ${isActive ? 'animate-bounce' : ''}`} />
                  </div>
                  
                  {/* Teks Status Deskripsi */}
                  <div className="pt-0.5">
                    <h4 className={`text-sm font-bold transition-colors ${
                      isActive ? 'text-[#4a2c11] text-base' : isCompleted ? 'text-[#4b3729]' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </h4>
                    <p className={`text-xs mt-0.5 leading-relaxed ${
                      isActive ? 'text-[#8c7661]' : isCompleted ? 'text-gray-400' : 'text-gray-300'
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              )
            })}

          </div>
        </div>

      </div>

    </article>
  )
}

export default ShippingAddress