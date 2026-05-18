import { useMemo } from 'react'
import { Crown, Coffee, Calendar, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

const MembershipCard = ({ subscription }) => {
  // 1. Ambil data kuota dari join table user_subscriptions & subscription_plans
  const remaining = Number(subscription?.remaining_quota ?? 0)
  const totalQuota = Number(subscription?.quota_cups ?? 0)
  const status = String(subscription?.status ?? 'inactive').toLowerCase()
  
  // Hitung persentase sisa kuota kopi untuk progress bar
  const percent = totalQuota > 0 ? Math.min(100, Math.round((remaining / totalQuota) * 100)) : 0

  // 2. Efek Visual Kartu Berdasarkan Paket Kopi yang Dipilih di TiDB
  const planTheme = useMemo(() => {
    const planName = String(subscription?.name ?? '').toLowerCase()
    
    if (planName.includes('unlimited') || planName.includes('office')) {
      return {
        bgGradient: 'from-[#2b1c10] via-[#523624] to-[#7c583f]',
        tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        progressBar: 'bg-gradient-to-r from-amber-400 to-amber-300',
        badge: 'VIP Coffee Pass'
      }
    }
    if (planName.includes('caffeine') || planName.includes('daily')) {
      return {
        bgGradient: 'from-[#1e293b] via-[#334155] to-[#475569]',
        tagBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
        progressBar: 'bg-gradient-to-r from-indigo-400 to-cyan-300',
        badge: 'Daily Caffeine'
      }
    }
    // Default / Starter Sip / Belum berlangganan
    return {
      bgGradient: 'from-[#4a2c11] via-[#3d2510] to-[#2b180a]',
      tagBg: 'bg-[#b08968]/20 text-[#ddb892] border-[#b08968]/30',
      progressBar: 'bg-[#b08968]',
      badge: 'Starter Sip'
    }
  }, [subscription?.name])

  // Format Tanggal Kadaluwarsa Langganan (TiDB expiry_date)
  const formattedExpiry = useMemo(() => {
    if (!subscription?.expiry_date) return '-'
    try {
      return new Date(subscription.expiry_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return subscription.expiry_date
    }
  }, [subscription?.expiry_date])

  // Kondisi jika user tidak mempunyai langganan aktif
  if (status !== 'active') {
    return (
      <article className="bg-white p-6 sm:p-8 rounded-[2rem] border border-dashed border-gray-200 shadow-sm flex flex-col justify-between h-full font-['Fredoka']">
        <div className="text-center py-8 my-auto flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
            <Coffee className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-[#2c1b0e]">Belum Berlangganan Kopi</h4>
          <p className="text-sm text-gray-400 max-w-xs mt-1 mb-6">
            Nikmati kopi harian pilihan dengan harga jauh lebih hemat lewat paket Coffee Subscription.
          </p>
          <button className="px-5 py-2.5 bg-[#4a2c11] text-white rounded-xl text-sm font-medium hover:bg-[#3d2510] transition-colors">
            Lihat Katalog Member
          </button>
        </div>
      </article>
    )
  }

  return (
    <article className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between h-full font-['Fredoka']">
      
      {/* HEADER KOMPONEN */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fcf8f4] border border-[#f0e2d5] text-[#4b3729]">
            <Crown className="h-5 w-5 text-[#b08968]" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-[#2c1b0e] mb-0.5">Coffee Pass</h3>
            <p className="text-xs text-gray-400">Tunjukkan kartu ini ke barista untuk klaim kuota cup.</p>
          </div>
        </div>
      </div>

      {/* KARTU SUBSCRIPTION UTAMA */}
      <div className={`w-full rounded-[2.5rem] bg-gradient-to-br ${planTheme.bgGradient} p-6 text-[#fff7ef] shadow-xl relative overflow-hidden transition-all duration-300`}>
        
        {/* Dekorasi Siluet Cup Kopi Lembut di Background */}
        <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none scale-150 transform rotate-12">
          <Coffee className="w-44 h-44" />
        </div>

        {/* Baris Atas Kartu */}
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <span className={`inline-block px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border ${planTheme.tagBg} mb-2`}>
              {planTheme.badge}
            </span>
            <h4 className="text-2xl font-bold tracking-wide drop-shadow-sm truncate max-w-[220px]">
              {subscription?.name || 'Paket Kopi'}
            </h4>
            <p className="text-xs text-white/60 font-light mt-0.5">Warung Kopi Subscription</p>
          </div>
          
          {/* Tampilan Sisa Cup Besar di Kanan Atas */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 text-center">
            <span className="block text-[24px] font-black leading-none text-white">{remaining}</span>
            <span className="text-[9px] uppercase tracking-wider text-white/70 block mt-1">Sisa Cup</span>
          </div>
        </div>

        {/* Status & Masa Berlaku Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-xs relative z-10">
          <div className="rounded-2xl bg-white/5 border border-white/5 p-3 backdrop-blur-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Status Paket</span>
              <strong className="block text-white capitalize">{status}</strong>
            </div>
          </div>
          
          <div className="rounded-2xl bg-white/5 border border-white/5 p-3 backdrop-blur-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-300 shrink-0" />
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Masa Berlaku</span>
              <strong className="block text-white truncate">{formattedExpiry}</strong>
            </div>
          </div>
        </div>

        {/* Kuota Progress Bar Track */}
        <div className="mt-6 relative z-10">
          <div className="mb-2 flex items-center justify-between text-xs text-white/80">
            <span className="font-medium">Sisa Kuota Langganan</span>
            <span className="font-bold">
              {remaining} / {totalQuota} Cup Tersedia
            </span>
          </div>
          
          <div className="h-2.5 overflow-hidden rounded-full bg-black/20 p-[1px] border border-white/5">
            <div 
              className={`h-full rounded-full ${planTheme.progressBar} transition-all duration-500 ease-out`} 
              style={{ width: `${percent}%` }} 
            />
          </div>
          
          <div className="mt-2 flex justify-between text-[11px] text-white/50">
            <span>Mulai: {subscription?.start_date ? new Date(subscription.start_date).toLocaleDateString('id-ID') : '-'}</span>
            {remaining === 0 ? (
              <span className="text-rose-300 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Kuota Habis!
              </span>
            ) : (
              <span>Gunakan sebelum kedaluwarsa</span>
            )}
          </div>
        </div>
      </div>

      {/* BENCHMARK / SUBSCRIPTION PERKS */}
      <div className="mt-5 rounded-2xl bg-[#fcf8f4] border border-[#f0e2d5]/60 p-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-[#b08968]">
          <RefreshCw className="h-4 w-4 animate-spin-slow" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-[#4b3729]">Cara Penukaran Mudah</span>
          <span className="text-[11px] text-gray-400 leading-relaxed">
            Setiap kali melakukan pemesanan di kasir atau via web, kuota `cups_used` akan dicatat ke dalam log penggunaan subscription kamu.
          </span>
        </div>
      </div>

    </article>
  )
}

export default MembershipCard