import { Link } from 'react-router-dom'

const FieldIcon = ({ type }) => {
  switch (type) {
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      )
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      )
    case 'lock':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      )
    default:
      return null
  }
}

const SocialButton = ({ label }) => {
  return (
    <button
      type="button"
      className="grid h-11 w-full place-items-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-[#f7f0e8] transition hover:bg-white/10"
      aria-label={label}
    >
      {label}
    </button>
  )
}

const AuthField = ({ icon, type = 'text', value, onChange, placeholder, autoComplete, name }) => {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#bfa68d]">{placeholder}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[#f8f0e6] focus-within:border-[#d9a46a]/60 focus-within:ring-2 focus-within:ring-[#d9a46a]/20">
        <span className="text-[#9a897a]">
          <FieldIcon type={icon} />
        </span>
        <input
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#8c7a69]"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          name={name}
        />
      </div>
    </label>
  )
}

const AuthShell = ({ title, subtitle, linkText, linkTo, children, footerText }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0b08] text-[#f8f0e6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,166,109,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,#130e0a_0%,#0f0b08_100%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-[1000px] gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/20 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-[#1a120b] shadow-[0_0_0_8px_rgba(255,255,255,0.03)]">
                  <div className="h-6 w-6 rounded-full border-2 border-[#8fa8c9] border-t-[#e4b36f] animate-spin" />
                </div>
                <div>
                  <strong className="block text-sm uppercase tracking-[0.35em] text-[#e6c49a]">Warung Kopi</strong>
                  <span className="text-sm text-[#cdb8a5]">Akun pelanggan</span>
                </div>
              </div>

              <h1 className="max-w-[10ch] text-5xl font-black leading-[0.92] tracking-tight text-[#fff7ef]">
                {title}
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-[#c9b6a4]">
                {subtitle}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#bfa68d]">Theme</div>
                <div className="mt-2 font-bold text-[#f8f0e6]">Coffee warm</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#bfa68d]">Route</div>
                <div className="mt-2 font-bold text-[#f8f0e6]">{linkTo}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#bfa68d]">State</div>
                <div className="mt-2 font-bold text-[#f8f0e6]">Synced</div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[460px] rounded-[2rem] border border-white/10 bg-[#17110c]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex justify-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-[#22160f] shadow-[0_0_0_6px_rgba(255,255,255,0.02)]">
                <div className="h-7 w-7 rounded-full border-2 border-[#8fa8c9] border-t-[#e4b36f] animate-spin" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#fff7ef]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#b8a695]">
                {subtitle}{' '}
                <Link to={linkTo} className="font-semibold text-[#f4c37e] hover:underline">
                  {linkText}
                </Link>
              </p>
            </div>

            <div className="mt-8">{children}</div>

            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#907a66]">Or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SocialButton label="Apple" />
              <SocialButton label="Google" />
              <SocialButton label="X" />
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-[#8f7e6e]">{footerText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AuthField }
export default AuthShell
