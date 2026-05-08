import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthField } from './AuthShell'
import { STORAGE_KEYS, writeStoredValue } from '../../data/customerStorage'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const authUser = {
      email,
      name: fullName || email.split('@') || 'Pelanggan Baru',
      mode: 'register',
      registeredAt: new Date().toISOString(),
    }

    writeStoredValue(STORAGE_KEYS.auth, authUser)
    writeStoredValue(STORAGE_KEYS.account, {
      mode: 'register',
      name: authUser.name,
      email: authUser.email,
      phone: '',
      address: '',
      city: 'Malang', // Saya sesuaikan ke Malang ya, San
    })

    window.dispatchEvent(new Event('warungkopi-state-changed'))
    navigate('/akun', { replace: true })
  }

  return (
    <div className="flex h-screen w-full bg-[#1b120d] font-['Fredoka'] overflow-hidden relative">
      {/* SISI KIRI: FORM REGISTER */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 md:px-20 lg:px-32">
        <Link to="/" className="mb-12 flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
          <img 
            src="/Logo Putih.png" 
            alt="Logo Warung Kopi" 
            className="h-10 w-auto object-contain" 
          />
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-[#fff3ec] leading-tight tracking-tight">
            Ayo Bergabung, <br /> Daftar Sekarang
          </h1>
          <p className="mt-3 text-base text-[#d7cdc7] font-medium">
            Daftar untuk menyimpan preferensi dan riwayat pemesananmu.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Field Nama Lengkap */}
            <AuthField
              icon="user"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Username"
              autoComplete="name"
              name="fullName"
              className="rounded-2xl border-white/10 bg-white/5 py-4 !text-white placeholder:text-gray-500 focus:border-[#e39b4f] focus:ring-[#e39b4f]"
            />
            
            {/* Field Email */}
            <AuthField
              icon="mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              autoComplete="email"
              name="email"
              className="rounded-2xl border-white/10 bg-white/5 py-4 !text-white placeholder:text-gray-500 focus:border-[#e39b4f] focus:ring-[#e39b4f]"
            />

            {/* Field Password */}
            <AuthField
              icon="lock"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="new-password"
              name="password"
              className="rounded-2xl border-white/10 bg-white/5 py-4 !text-white placeholder:text-gray-500 focus:border-[#e39b4f] focus:ring-[#e39b4f]"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full md:w-fit rounded-2xl bg-[#e39b4f] px-12 py-4 font-bold text-[#1b120d] shadow-lg shadow-orange-900/20 transition-all hover:scale-105 hover:brightness-105 active:scale-95"
          >
            Register
          </button>
        </form>

        <p className="mt-12 text-sm text-[#c6c6c6] font-medium">
          Sudah punya akun? {' '}
          <Link to="/login" className="font-bold !text-[#ffa748] hover:underline">
            Masuk
          </Link>
        </p>
      </div>

      {/* SISI KANAN: BACKGROUND GAMBAR */}
      <div className="hidden h-full w-1/2 p-4 md:block">
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] flex items-center justify-center bg-[#1b120d]">
          <img 
            src="/Pageregister.jpg" 
            alt="Background Register" 
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage