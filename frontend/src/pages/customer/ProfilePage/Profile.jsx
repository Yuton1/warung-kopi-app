import { Crown, LogOut, Sparkles, Star, Ticket, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

const formatMemberSince = (value) => {
  if (!value) return 'Baru Bergabung'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
}

const resolveStatIcon = (label = '') => {
  const normalized = String(label).toLowerCase()

  if (
    normalized.includes('order') ||
    normalized.includes('pesanan') ||
    normalized.includes('transaksi')
  ) {
    return Ticket
  }

  if (
    normalized.includes('point') ||
    normalized.includes('poin') ||
    normalized.includes('loyalty')
  ) {
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
  role,
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
    <section className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-[2.5rem] border border-[#ead9ca] bg-gradient-to-br from-[#fffaf5] via-[#fff7ef] to-[#f7ede0] p-5 shadow-[0_18px_40px_rgba(70,40,20,0.06)] transition-all duration-500 hover:shadow-[0_22px_45px_rgba(70,40,20,0.09)] sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[#4a3728] text-2xl font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-300 hover:rotate-6 sm:h-20 sm:w-20 sm:rounded-[26px] sm:text-3xl">
            {initials || 'WK'}
          </div>

          <div className="min-w-0 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2e3d3] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c7661]">
              <UserRound className="h-3 w-3" />
              Customer Profile
            </span>

            <h2 className="truncate text-2xl font-extrabold tracking-tight text-[#2c1b0e] sm:text-3xl">
              {displayName}
            </h2>

            <p className="truncate text-xs font-medium text-[#7e6b5a] sm:text-sm">
              {email || 'Belum login'}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#b08968] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm transition-transform hover:scale-105">
              <Crown className="h-3 w-3 text-amber-300" />
              {String(displayTier).toUpperCase()}
            </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#8c7661] shadow-xs">
                <Sparkles className="h-3 w-3 text-[#c9a96e]" />
                Since {formatMemberSince(created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 xl:min-w-[440px] sm:gap-4">
          {stats.map((stat) => {
            const Icon = resolveStatIcon(stat.label)

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-[#f3e9de] bg-white/80 p-3 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md sm:p-4"
              >
                <div className="absolute inset-0 bg-[#fbf5ee] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-[#f3e4d3] text-[#a67b53] transition-colors group-hover:bg-[#4a3728] group-hover:text-white sm:h-9 sm:w-9">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>

                <p className="relative z-10 mt-2 truncate text-[9px] font-bold uppercase tracking-wider text-[#8c7661] sm:text-[10px]">
                  {stat.label}
                </p>

                <strong className="relative z-10 mt-0.5 block text-base font-black text-[#4b3729] sm:text-xl">
                  {stat.value}
                </strong>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5 border-t border-[#ead9ca]/40 pt-5">
        {isLoggedIn ? (
          <button
            type="button"
            onClick={onLogout}
            className="group inline-flex items-center gap-2 rounded-xl bg-[#2c1b0e] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1f130a] hover:shadow-md active:scale-98 sm:text-sm"
          >
            <LogOut className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
            Logout Akun
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#2c1b0e] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1f130a] hover:shadow-md active:scale-98 sm:text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-[#d7c1ad] bg-white px-5 py-2.5 text-xs font-bold text-[#4b3729] transition-all hover:bg-[#f8f1e8] active:scale-98 sm:text-sm"
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
