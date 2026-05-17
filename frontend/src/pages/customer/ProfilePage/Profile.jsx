// C:\laragon\www\WarungKopi\frontend\src\pages\customer\ProfilePage\Profile.jsx
import { Crown, LogOut, Sparkles, Star, Ticket, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

const Profile = ({ name, email, tier, memberSince, stats = [], initials, isLoggedIn, onLogout }) => {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden rounded-[2.5rem] border border-[#ead9ca] bg-gradient-to-br from-[#fffaf5] via-[#fff7ef] to-[#f7ede0] p-5 sm:p-8 shadow-[0_18px_40px_rgba(70,40,20,0.06)] transition-all hover:shadow-[0_22px_45px_rgba(70,40,20,0.09)]">
      
      {/* Container Utama: Responsif Fleksibel */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        
        {/* Bagian Kiri: Avatar & Biodata Singkat */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          
          {/* Avatar Lingkaran / Kotak Khas */}
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-[22px] sm:rounded-[26px] bg-[#4a3728] text-2xl sm:text-3xl font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform hover:rotate-6 duration-300">
            {initials || 'WK'}
          </div>

          {/* Label, Nama, dan Email */}
          <div className="min-w-0 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2e3d3] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c7661]">
              <UserRound className="h-3 w-3" />
              Customer Profile
            </span>
            
            <h2 className="truncate text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2c1b0e]">
              {name || 'Tamu Warung Kopi'}
            </h2>
            
            <p className="truncate text-xs sm:text-sm text-[#7e6b5a] font-medium">
              {email || 'Belum terotentikasi'}
            </p>

            {/* Badges Level Keanggotaan */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#b08968] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm transition-transform hover:scale-105">
                <Crown className="h-3 w-3 text-amber-300" />
                {tier || 'Bronze'} Member
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#8c7661] shadow-xs">
                <Sparkles className="h-3 w-3 text-[#c9a96e]" />
                Since {memberSince || 'Baru'}
              </span>
            </div>
          </div>
        </div>

        {/* Bagian Kanan: Grid Statistik Finansial & Loyalitas */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 xl:min-w-[440px]">
          {stats.map((stat) => {
            // Pemetaan ikon dinamis
            const Icon = 
              stat.label === 'Total Orders' ? Ticket : 
              stat.label === 'Loyalty Points' ? Star : Sparkles

            return (
              <div 
                key={stat.label} 
                className="group relative overflow-hidden rounded-2xl bg-white/80 p-3 sm:p-4 text-center shadow-xs border border-[#f3e9de] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
              >
                {/* Efek Sorotan Background Kopi Tipis saat Kursor Dekat */}
                <div className="absolute inset-0 bg-[#fbf5ee] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative z-10 mx-auto flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#f3e4d3] text-[#a67b53] transition-colors group-hover:bg-[#4a3728] group-hover:text-white">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                
                <p className="relative z-10 mt-2 truncate text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7661]">
                  {stat.label}
                </p>
                
                <strong className="relative z-10 mt-0.5 block text-base sm:text-xl font-black text-[#4b3729]">
                  {stat.value}
                </strong>
              </div>
            )
          })}
        </div>
      </div>

      {/* Baris Tombol Aksi Bawah */}
      <div className="mt-6 flex flex-wrap gap-2.5 border-t border-[#ead9ca]/40 pt-5">
        {isLoggedIn ? (
          <button
            type="button"
            onClick={onLogout}
            className="group inline-flex items-center gap-2 rounded-xl bg-[#2c1b0e] px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-sm hover:bg-[#1f130a] hover:shadow-md active:scale-98"
          >
            <LogOut className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
            Logout Akun
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#2c1b0e] px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-sm hover:bg-[#1f130a] hover:shadow-md active:scale-98"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-[#d7c1ad] bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#4b3729] transition-all hover:bg-[#f8f1e8] active:scale-98"
            >
              Gabung Member
            </Link>
          </>
        )}
      </div>
    </section>
  )
}

export default Profile