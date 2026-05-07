import { Link } from 'react-router-dom'
import { ArrowLeft, Crown, LogOut, Sparkles, UserRound } from 'lucide-react'

const Profile = ({
  name,
  email,
  tier,
  memberSince,
  stats = [],
  initials,
  isLoggedIn,
  onLogout,
}) => {
  return (
    <section className="screen-hero">
      <div className="flex flex-col justify-center">
        <span className="eyebrow">Akun Saya</span>
        <h1>Profil, membership, dan alamat pelanggan dalam satu tempat.</h1>
        <p>
          Halaman ini merangkum identitas pelanggan, kartu membership, alamat tersimpan, dan tracking pengiriman
          supaya user bisa mengelola akun tanpa pindah halaman.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke menu
          </Link>
          {isLoggedIn ? (
            <button type="button" className="btn btn-primary" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="screen-hero__card">
        <span className="eyebrow">Akses cepat</span>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <strong className="block truncate text-2xl leading-tight">{name}</strong>
            <p className="truncate text-sm">{email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-white/85">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold">
            <Crown className="h-4 w-4" />
            {tier} Member
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold">
            <Sparkles className="h-4 w-4" />
            Since {memberSince}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/10 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">{stat.label}</p>
              <strong className="mt-1 block text-lg">{stat.value}</strong>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Status</p>
              <strong className="text-base">Profil siap dipakai</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
