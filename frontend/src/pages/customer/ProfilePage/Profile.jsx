// C:\laragon\www\WarungKopi\frontend\src\pages\customer\ProfilePage\Profile.jsx
import { Crown, LogOut, Sparkles, Star, Ticket, UserRound, Coffee } from 'lucide-react'
import { Link } from 'react-router-dom'

const formatMemberSince = (value) => {
  if (!value) return 'Baru Bergabung'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
}

const resolveStatIcon = (label = '') => {
  const normalized = String(label).toLowerCase()
  if (normalized.includes('order') || normalized.includes('pesanan') || normalized.includes('transaksi')) {
    return Ticket
  }
  if (normalized.includes('point') || normalized.includes('poin') || normalized.includes('loyalty')) {
    return Star
  }
  return Sparkles
}

const tierFromPoints = (points = 0) => {
  if (points >= 3000) return 'Platinum Member'
  if (points >= 1500) return 'Gold Member'
  if (points >= 500) return 'Silver Member'
  return 'Bronze Member'
}

const Profile = ({
  username,
  email,
  membershipStatus,
  created_at,
  points = 0,
  stats = [],
  initials,
  isLoggedIn,
  onLogout,
}) => {
  const displayName = username || 'Tamu Warung Kopi'
  const displayTier = membershipStatus || (Number(points) > 0 ? tierFromPoints(Number(points)) : 'Bronze Member')

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden rounded-[2rem] border border-[#e1d0c1] bg-white shadow-[0_20px_50px_rgba(44,27,14,0.05)] grid grid-cols-1 lg:grid-cols-12">
      
      {/* SISI KIRI: Banner Edukasi/Informasi Aplikasi (Aksen Kopi Estetik) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#362517] to-[#20140a] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden text-white">
        {/* Pola Dekorasi Lingkaran Latar Belakang */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-52 h-52 bg-[#b08968]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d4bca7]">
            <Coffee className="h-3 w-3" />
            Warung Kopi App
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight leading-tight text-[#fff5eb]">
            Profil, membership, &amp; poin dalam satu tempat.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#c4b2a2] leading-relaxed font-medium">
            Halaman ini terhubung langsung dengan basis data TiDB. Semua pembaruan nama, poin loyalitas, serta riwayat belanja Anda tersinkronisasi secara aman.
          </p>
        </div>

        {/* Tombol Aksi Utama Sisi Kiri */}
        <div className="mt-8 pt-6 border-t border-white/10 relative z-10 flex flex-wrap gap-3">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="group inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-red-900/20 active:scale-98"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Logout Akun
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#2c1b0e] shadow-sm transition-all hover:bg-[#fff5eb] active:scale-98"
              >
                Login Masuk
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10 active:scale-98"
              >
                Gabung Member
              </Link>
            </>
          )}
        </div>
      </div>

      {/* SISI KANAN: Kartu Identitas & Statistik Member (Bersih & Modern) */}
      <div className="lg:col-span-7 bg-gradient-to-br from-[#fffdfb] to-[#fcf8f4] p-8 sm:p-10 flex flex-col justify-center gap-8">
        
        {/* Baris Data Utama */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar Pelanggan */}
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-[#4a3728] text-xl sm:text-2xl font-black text-white shadow-[0_10px_25px_rgba(74,55,40,0.15)] transition-transform duration-300 hover:rotate-6">
            {initials || 'WK'}
          </div>

          {/* Teks Pengguna */}
          <div className="min-w-0 space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3e5d8] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8c7661]">
              <UserRound className="h-3 w-3" />
              Identitas Terverifikasi
            </span>
            <h3 className="truncate text-2xl font-black tracking-tight text-[#2c1b0e]">
              {displayName}
            </h3>
            <p className="truncate text-xs font-semibold text-[#7e6b5a]">
              {email || 'Alamat email belum diatur'}
            </p>

            {/* Badges Level */}
            <div className="flex flex-wrap gap-2 pt-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#b08968] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                <Crown className="h-3 w-3 text-amber-300" />
                {String(displayTier).toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white border border-[#ebd9ca] px-2 py-0.5 text-[10px] font-bold text-[#8c7661] shadow-xs">
                <Sparkles className="h-3 w-3 text-[#c9a96e]" />
                Since {formatMemberSince(created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Grid 3 Box Indikator Poin / Total Order */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = resolveStatIcon(stat.label)

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl border border-[#f0e2d5] bg-white p-3 text-center shadow-[0_4px_12px_rgba(70,40,20,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Micro-glow on Hover */}
                <div className="absolute inset-0 bg-[#fdfaf7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#fcf2e8] text-[#a67b53] transition-colors group-hover:bg-[#4a3728] group-hover:text-white">
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <p className="relative z-10 mt-2 truncate text-[9px] font-bold uppercase tracking-wider text-[#9c8470]">
                  {stat.label}
                </p>

                <strong className="relative z-10 mt-0.5 block text-base font-black text-[#2c1b0e] sm:text-xl">
                  {stat.value}
                </strong>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default Profile