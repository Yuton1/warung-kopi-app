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
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden rounded-[2.5rem] border border-[#3d2719] bg-gradient-to-br from-[#23150c] via-[#2c1b10] to-[#1a0f08] p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(44,27,14,0.3)] text-white">
      
      {/* Kontainer Utama Layout Split antara Deskripsi Kiri & Data Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg!-[#ecb176]/10 border border-[#ecb176]/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#ecb176]">
              <Coffee className="h-3.5 w-3.5" />
              Warung Kopi App
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-[#fff5eb]">
              Profil, membership, &amp; poin dalam satu tempat.
            </h2>
            <p className="text-sm text-[#c4b2a2] leading-relaxed font-normal">
              Halaman ini terhubung langsung dengan basis data TiDB. Semua pembaruan nama, poin loyalitas, serta riwayat belanja Anda tersinkronisasi secara aman.
            </p>
          </div>

          {/* Tombol Logout / Autentikasi (Kontras Tinggi) */}
          <div className="pt-4 flex flex-wrap gap-3">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={onLogout}
                className="group inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-red-900/30 active:scale-95"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Logout Akun
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-[#ecb176] px-6 py-3 text-xs font-bold text-[#1a0f08] shadow-md transition-all hover:bg-[#ffc288] active:scale-95"
                >
                  Login Masuk
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold text-white transition-all hover:bg-white/10 active:scale-95"
                >
                  Gabung Member
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ================= SISI KANAN: IDENTITAS & KARTU STATISTIK ================= */}
        <div className="lg:col-span-7 space-y-8 bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 sm:p-8 backdrop-blur-xs">
          
          {/* Header Profil User */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Bulat Kotak */}
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-[#ecb176] text-xl sm:text-2xl font-black text-[#2c1b10] shadow-[0_10px_30px_rgba(236,177,118,0.2)]">
              {initials || 'WK'}
            </div>

            {/* Nama & Email */}
            <div className="min-w-0 space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#d4bca7]">
                <UserRound className="h-3 w-3 text-[#ecb176]" />
                Akses Cepat Pelanggan
              </span>
              <h3 className="truncate text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {displayName}
              </h3>
              <p className="truncate text-xs font-medium text-[#c4b2a2]">
                {email || 'Alamat email belum login'}
              </p>

              {/* Status Badge */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#ecb176] px-2.5 py-0.5 text-[10px] font-extrabold text-[#2c1b10] shadow-sm">
                  <Crown className="h-3 w-3 text-[#8a5624]" />
                  {String(displayTier).toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#e4d5c7]">
                  <Sparkles className="h-3 w-3 text-[#ecb176]" />
                  Since {formatMemberSince(created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Box Indikator Poin / Total Order (Semi-Transparent Premium Glass) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map((stat) => {
              const Icon = resolveStatIcon(stat.label)

              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:border-[#ecb176]/40"
                >
                  {/* Ikon Stat */}
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-[#ecb176] transition-colors group-hover:bg-[#ecb176] group-hover:text-[#2c1b10]">
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Label Nama Kolom */}
                  <p className="mt-3 truncate text-[10px] font-bold uppercase tracking-widest text-[#a89280]">
                    {stat.label}
                  </p>

                  {/* Nilai / Angka Utama */}
                  <strong className="mt-1 block text-lg font-black text-white sm:text-2xl tracking-tight">
                    {stat.value}
                  </strong>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}

export default Profile