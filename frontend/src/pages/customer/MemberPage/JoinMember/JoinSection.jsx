import { Link } from 'react-router-dom'
import { ArrowRight, Coffee, Crown, Sparkles, Star, Users, Zap } from 'lucide-react'

const CoffeeCupIllustration = () => (
  <div className="relative mx-auto w-[220px] max-w-full">
    <div className="absolute -inset-8 rounded-full bg-[#ffb703]/10 blur-3xl" />
    <svg viewBox="0 0 220 220" className="relative z-10 h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="memberCup" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff7ef" />
          <stop offset="100%" stopColor="#f1d9bf" />
        </linearGradient>
      </defs>
      <ellipse cx="112" cy="184" rx="70" ry="11" fill="#4a3728" opacity="0.08" />
      <path
        d="M62 78h94l-10 70c-2 13-13 22-26 22H98c-13 0-24-9-26-22L62 78Z"
        fill="url(#memberCup)"
        stroke="#4a3728"
        strokeWidth="3"
      />
      <ellipse cx="109" cy="79" rx="47" ry="11" fill="#fff7ef" stroke="#4a3728" strokeWidth="3" />
      <ellipse cx="109" cy="89" rx="38" ry="7" fill="#4a3728" opacity="0.72" />
      <path
        d="M156 92c20 0 27 21 20 34-5 10-14 11-20 8"
        fill="none"
        stroke="#4a3728"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M87 58c0-12 8-17 4-29" stroke="#b08968" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      <path d="M108 52c0-13-6-18 0-32" stroke="#b08968" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <path d="M129 58c0-12-6-17 0-29" stroke="#b08968" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
      <circle cx="94" cy="125" r="7" fill="#ffb703" opacity="0.55" />
      <circle cx="118" cy="128" r="5" fill="#fb8500" opacity="0.35" />
    </svg>
  </div>
)

const JoinSection = () => {
  return (
    <section className="pattern-bg overflow-hidden rounded-[32px] border border-[#e4ccb5] bg-gradient-to-br from-[#f5ebe0] via-white/50 to-[#f0decd] shadow-[0_24px_60px_rgba(45,25,15,0.08)]">
      <div className="grid items-center gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12 lg:p-16">
        <div className="text-center md:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffb703]/20 bg-[#ffb703]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#4a3728]">
            <Crown className="h-4 w-4 text-[#ffb703]" />
            Eksklusif Member
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-[#4a3728] md:text-5xl">
            Gabung Member Warkop & hemat sampai{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#b08968]">30%</span>
              <span className="absolute bottom-1 left-0 right-0 -z-0 h-3 rounded bg-[#ffb703]/20" />
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#6f6257] md:text-base">
            Dapatkan akses ke promo eksklusif, kumpulkan poin setiap pembelian, dan nikmati pengalaman memesan
            yang lebih personal di Warung Kopi.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Link
              to="/register"
              className="btn btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-[15px]"
            >
              <Coffee className="h-5 w-5" />
              Daftar Member
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="btn btn-secondary inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-[15px]"
            >
              <Sparkles className="h-5 w-5" />
              Masuk
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-[#7b6a5b] md:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#fb8500]" />
              Aktivasi instan
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-[#ffb703]" />
              4.9 rating
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#b08968]" />
              12K+ member
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-[360px] rounded-[30px] border border-white/60 bg-white/55 p-6 shadow-[0_22px_46px_rgba(45,25,15,0.08)] backdrop-blur-sm">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#ffb703]/10 blur-2xl" />
            <CoffeeCupIllustration />
            <div className="mt-6 grid gap-3 rounded-[24px] bg-[#4a3728] p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/65">Member Benefit</span>
                <span className="rounded-full bg-[#ffb703] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#3a2a1e]">
                  New
                </span>
              </div>
              <strong className="text-2xl leading-tight">Diskon, poin, dan prioritas antrian.</strong>
              <p className="text-sm leading-6 text-white/75">
                Semua keuntungan member aktif langsung tersimpan di akun kamu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinSection
