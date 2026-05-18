import { useMemo } from 'react'
import { Crown, Gift, Percent, Star, Truck, Zap, Coffee, Calendar } from 'lucide-react'

const MembershipCard = ({ membership }) => {
  // 1. Menghitung Progress Berdasarkan Poin atau Kuota Cup yang Tersisa
  const points = Number(membership?.points ?? 0)
  const target = Number(membership?.pointsTarget ?? 1000)
  const percent = Math.min(100, Math.round((points / target) * 100))

  // 2. Setup Tema Visual Kartu Berdasarkan Tier (Bronze, Silver, Gold, atau Nama Paket Langganan TiDB)
  const cardTheme = useMemo(() => {
    const tierName = String(membership?.tier ?? 'Bronze').toLowerCase()
    
    if (tierName.includes('gold') || tierName.includes('unlimited') || tierName.includes('office')) {
      return {
        bgGradient: 'from-[#3a2212] via-[#6f4e37] to-[#967155]',
        tagBg: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
        progressBar: 'bg-gradient-to-r from-amber-400 to-yellow-300',
        label: 'Premium Pass'
      }
    }
    if (tierName.includes('silver') || tierName.includes('caffeine')) {
      return {
        bgGradient: 'from-[#232526] via-[#414345] to-[#707375]',
        tagBg: 'bg-slate-300/20 text-slate-200 border-slate-300/30',
        progressBar: 'bg-gradient-to-r from-slate-300 to-slate-100',
        label: 'Coffee Enthusiast'
      }
    }
    // Default / Bronze / Starter Sip
    return {
      bgGradient: 'from-[#4a2c11] via-[#3d2510] to-[#2b180a]',
      tagBg: 'bg-[#b08968]/20 text-[#ddb892] border-[#b08968]/30',
      progressBar: 'bg-[#b08968]',
      label: 'Warm Companion'
    }
  }, [membership?.tier])

  // Format Tanggal Valid agar lebih ramah dibaca (UI/UX Lokal Indonesia)
  const formattedExpiry = useMemo(() => {
    if (!membership?.validThrough) return 'Selamanya'
    try {
      return new Date(membership.validThrough).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return membership.validThrough
    }
  }, [membership?.validThrough])

  return (
    <article className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between h-full font-['Fredoka']">
      
      {/* HEADER UTAMA */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fcf8f4] border border-[#f0e2d5] text-[#4b3729]">
            <Crown className="h-5 w-5 text-[#b08968]" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-[#2c1b0e] mb-0.5">Kartu Kopi Digital</h3>
            <p className="text-xs text-gray-400">Level & loyalitas subscription Anda.</p>
          </div>
        </div>
      </div>

      {/* TAMPILAN UTAMA KARTU (Premium Coffee Card Glass) */}
      <div className={`w-full rounded-[2.5rem] bg-gradient-to-br ${cardTheme.bgGradient} p-6 text-[#fff7ef] shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl`}>
        
        {/* Dekorasi Aksen Lingkaran Biji Kopi Abstrak di Background */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 top-[-20%] w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

        {/* Baris Atas Kartu */}
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <span className={`inline-block px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border ${cardTheme.tagBg} mb-2`}>
              {membership?.tier ?? 'Bronze'} Member
            </span>
            <h4 className="text-2xl font-bold tracking-wide drop-shadow-sm truncate max-w-[220px] sm:max-w-[320px]">
              {membership?.name || 'Pelanggan Setia'}
            </h4>
            <p className="text-xs text-white/60 font-light mt-0.5">{cardTheme.label}</p>
          </div>
          
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 text-right min-w-[90px]">
            <p className="text-[9px] uppercase tracking-wider text-white/50">ID Member</p>
            <strong className="block text-sm font-bold tracking-wider mt-0.5 text-white">
              {membership?.memberCode || 'WK-0000'}
            </strong>
          </div>
        </div>

        {/* Informasi Atribut Tengah (3 Kolom Grid Responsif) */}
        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-xs relative z-10">
          <div className="rounded-2xl bg-white/5 border border-white/5 p-3 backdrop-blur-sm">
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/50 mb-1">
              <Calendar className="h-3 w-3" /> Sejak
            </span>
            <strong className="block text-white truncate">{membership?.memberSince || '-'}</strong>
          </div>
          
          <div className="rounded-2xl bg-white/5 border border-white/5 p-3 backdrop-blur-sm">
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/50 mb-1">
              <Coffee className="h-3 w-3" /> Berlaku
            </span>
            <strong className="block text-white truncate">{formattedExpiry}</strong>
          </div>
          
          <div className="rounded-2xl bg-white/5 border border-white/5 p-3 backdrop-blur-sm bg-white/10">
            <span className="block text-[9px] uppercase tracking-wider text-amber-300 font-bold mb-1">
              ⭐ POIN TOKO
            </span>
            <strong className="block text-amber-300 text-sm font-bold">{points}</strong>
          </div>
        </div>

        {/* Indikator Bar Progress Leveling Up */}
        <div className="mt-6 relative z-10">
          <div className="mb-2 flex items-center justify-between text-xs text-white/80">
            <span className="font-medium">Progress Level Akun</span>
            <span className="font-bold bg-white/10 px-2 py-0.5 rounded-lg text-[11px]">
              {points} / {target} Pts
            </span>
          </div>
          
          {/* Track Bar */}
          <div className="h-3 overflow-hidden rounded-full bg-black/20 p-[2px] border border-white/10">
            <div 
              className={`h-full rounded-full ${cardTheme.progressBar} transition-all duration-500 ease-out`} 
              style={{ width: `${percent}%` }} 
            />
          </div>
          
          <div className="mt-2 flex justify-between text-[11px] text-white/60">
            <span>{membership?.tier || 'Bronze'} Tier</span>
            {target - points > 0 ? (
              <span className="text-amber-200 font-medium">{target - points} pts lagi ke tier berikutnya</span>
            ) : (
              <span className="text-emerald-300 font-bold">Tier Maksimal Tercapai ✨</span>
            )}
          </div>
        </div>
      </div>

      {/* BENEFIT GRID & BENEFIT PERKS (4 Keuntungan Utama Pelanggan) */}
      <div className="mt-6 grid gap-3 grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl bg-[#fcf8f4] border border-[#f0e2d5]/60 px-4 py-3.5 transition-all hover:bg-[#f7ece1]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-[#b08968]">
            <Percent className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#4b3729]">Diskon 10%</span>
            <span className="text-[10px] text-gray-400">Semua varian kopi</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-[#fcf8f4] border border-[#f0e2d5]/60 px-4 py-3.5 transition-all hover:bg-[#f7ece1]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-[#b08968]">
            <Truck className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#4b3729]">Gratis Ongkir</span>
            <span className="text-[10px] text-gray-400">Radius max 5 Km</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-[#fcf8f4] border border-[#f0e2d5]/60 px-4 py-3.5 transition-all hover:bg-[#f7ece1]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-[#b08968]">
            <Gift className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#4b3729]">Kopi Ultah</span>
            <span className="text-[10px] text-gray-400">1 Cup free gratis</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-[#fcf8f4] border border-[#f0e2d5]/60 px-4 py-3.5 transition-all hover:bg-[#f7ece1]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-[#b08968]">
            <Zap className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#4b3729]">Jalur VIP</span>
            <span className="text-[10px] text-gray-400">Prioritas antrean barista</span>
          </div>
        </div>
      </div>

      {/* FOOTER INFORMASI STATUS */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-[#8c7661]">
        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
        <span>Sistem mendeteksi benefit <b>{membership?.tier || 'Bronze'}</b> aktif sepenuhnya.</span>
      </div>

    </article>
  )
}

export default MembershipCard