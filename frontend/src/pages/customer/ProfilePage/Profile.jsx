import { Crown, LogOut, Sparkles, Star, Ticket, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

const Profile = ({ name, email, tier, memberSince, stats = [], initials, isLoggedIn, onLogout }) => {
  return (
    <section className="overflow-hidden rounded-[2.5rem] border border-[#ead9ca] bg-gradient-to-br from-[#fffaf5] via-[#fff7ef] to-[#f7ede0] px-6 py-6 shadow-[0_18px_40px_rgba(70,40,20,0.08)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#4a3728] text-3xl font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            {initials || 'WK'}
          </div>

          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f2e3d3] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8c7661]">
              <UserRound className="h-3.5 w-3.5" />
              Customer Profile
            </span>
            <h2 className="mt-3 truncate text-3xl font-extrabold text-[#2c1b0e]">{name || 'Tamu Warung Kopi'}</h2>
            <p className="mt-1 truncate text-sm text-[#7e6b5a]">{email || 'Belum login'}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#b08968] px-3 py-1 text-xs font-bold text-white">
                <Crown className="h-3.5 w-3.5" />
                {tier || 'Bronze'} Member
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8c7661] shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#c9a96e]" />
                Since {memberSince || 'Baru bergabung'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
          {stats.map((stat) => {
            const Icon = stat.label === 'Total Orders' ? Ticket : stat.label === 'Loyalty Points' ? Star : Sparkles

            return (
              <div key={stat.label} className="rounded-2xl bg-white/85 p-4 text-center shadow-sm">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3e4d3] text-[#a67b53]">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#8c7661]">{stat.label}</p>
                <strong className="mt-1 block text-lg text-[#4b3729]">{stat.value}</strong>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {isLoggedIn ? (
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2c1b0e] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#3b2416]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#2c1b0e] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#3b2416]"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#d7c1ad] bg-white px-5 py-3 text-sm font-bold text-[#4b3729] transition-all hover:bg-[#f8f1e8]"
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
