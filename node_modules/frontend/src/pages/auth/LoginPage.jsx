import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios' // Gunakan axios untuk koneksi ke backend/TiDB
import { AuthField } from './AuthShell'
import { STORAGE_KEYS, writeStoredValue } from '../../data/customerStorage'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const API_BASE_URL = getApiBaseUrl()
  const loginUrl = API_BASE_URL ? `${API_BASE_URL}/api/auth/login` : '/api/auth/login'

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      // 1. Menggunakan API_BASE_URL agar tidak error saat di-deploy
      const response = await axios.post(loginUrl, { 
        email, 
        password 
      });

      // 2. Ambil data user asli dari database (seperti yang terlihat di image_7048d1.png)
      const { user, token } = response.data;
      const userRole = user.role; // Mengambil 'barista' atau 'admin' dari kolom role

      const authUser = {
        name: user.username,
        role: userRole,
        email: user.email,
        mode: 'login',
        loggedInAt: new Date().toISOString(),
      }

      // 3. Simpan sesi login
      writeStoredValue(STORAGE_KEYS.auth, authUser)
      writeStoredValue(STORAGE_KEYS.account, {
        ...authUser,
        city: 'Malang',
      })
      localStorage.setItem("token", token);

      window.dispatchEvent(new Event('warungkopi-state-changed'))

      // 4. Navigasi otomatis sesuai role di database
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else if (userRole === 'barista') {
        navigate('/barista', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (err) {
      console.error("Login Error:", err)

      const serverMessage = err.response?.data?.message || err.response?.data?.error
      const isNetworkError = err.code === 'ERR_NETWORK'

      alert(serverMessage || (isNetworkError
        ? 'Tidak bisa menghubungi API login. Cek deploy backend, rewrite /api, dan env TiDB.'
        : 'Login gagal. Periksa email/password atau log backend.'))
    }
  }

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      
      {/* SISI KIRI: FORM LOGIN */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 md:px-20 lg:px-32">
        {/* Brand/Logo Section */}
        <div className="mb-12 flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[#1b120d]" />
          <span className="text-xl font-bold tracking-tight text-[#1b120d]">WarungKopi</span>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#1b120d] leading-tight">
            Halo, <br /> Welcome Back
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Hey, welcome back to your favorite coffee place.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <AuthField
              icon="mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              autoComplete="email"
              name="email"
              className="rounded-xl border-gray-200 py-3 focus:border-[#e39b4f] focus:ring-[#e39b4f]"
            />
            <AuthField
              icon="lock"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              name="password"
              className="rounded-xl border-gray-200 py-3 focus:border-[#e39b4f] focus:ring-[#e39b4f]"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#e39b4f] focus:ring-[#e39b4f]" 
              />
              Remember me
            </label>
            <Link to="/forgot-password" title="Lupa password?" className="font-semibold text-gray-500 hover:text-[#e39b4f]">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-4 w-fit rounded-xl bg-[#e39b4f] px-10 py-3 font-bold text-white shadow-lg shadow-orange-200 transition-all hover:scale-105 hover:brightness-105 active:scale-95"
          >
            Sign In
          </button>
        </form>

        <p className="mt-12 text-xs text-gray-500">
          Don't have an account? {' '}
          <Link to="/register" className="font-bold text-[#e39b4f] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* SISI KANAN: ILUSTRASI DENGAN GRADIENT KOPI */}
      <div className="hidden h-full w-1/2 p-4 md:block">
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#4A3728] via-[#2B1B17] to-[#1b120d] flex items-center justify-center">
          
          <div className="absolute top-[-10%] right-[-10%] h-80 w-80 rounded-full bg-[#e39b4f] opacity-20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-80 w-80 rounded-full bg-[#e39b4f] opacity-10 blur-[100px]" />

          <div className="relative z-10 flex flex-col items-center text-center px-12">
            <img 
              src="/coffee-illustration.png" 
              alt="Coffee Illustration" 
              className="w-4/5 drop-shadow-2xl transition-transform duration-700 hover:scale-105"
            />
            <h2 className="mt-8 text-3xl font-bold text-white">The best beans, <br />the best brew.</h2>
            <p className="mt-4 text-sm text-gray-300 max-w-xs">Nikmati kemudahan memesan kopi favoritmu kapan saja dan di mana saja.</p>
          </div>

          <div className="absolute bottom-10 right-10 opacity-30">
             <span className="text-white font-black tracking-widest text-2xl">WARUNGKOPI</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
