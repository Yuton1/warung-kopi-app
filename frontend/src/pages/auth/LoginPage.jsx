import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { AuthField } from './AuthShell'
import { STORAGE_KEYS, writeStoredValue } from '../../data/customerStorage'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [notice, setNotice] = useState('')

  const API_BASE_URL = getApiBaseUrl()
  const loginUrl = API_BASE_URL ? `${API_BASE_URL}/api/auth/login` : '/api/auth/login'

  useEffect(() => {
    const state = location.state || {}

    if (state.email) {
      setEmail(state.email)
    }

    if (state.password) {
      setPassword(state.password)
    }

    if (state.message) {
      setNotice(state.message)
    }
  }, [location.state])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post(loginUrl, {
        email,
        password,
      })

      const { user, token } = response.data
      const userRole = user.role

      const authUser = {
        name: user.username,
        role: userRole,
        email: user.email,
        mode: 'login',
        loggedInAt: new Date().toISOString(),
      }

      writeStoredValue(STORAGE_KEYS.auth, authUser)
      writeStoredValue(STORAGE_KEYS.account, {
        ...authUser,
        city: 'Malang',
      })
      localStorage.setItem('token', token)

      window.dispatchEvent(new Event('warungkopi-state-changed'))

      if (userRole === 'admin') {
        navigate('/admin', { replace: true })
      } else if (userRole === 'barista') {
        navigate('/barista', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      console.error('Login Error:', err)

      const serverData = err.response?.data
      const serverMessage =
        typeof serverData === 'string'
          ? serverData
          : serverData?.message || serverData?.error || err.response?.data?.message || err.response?.data?.error

      const isNetworkError = err.code === 'ERR_NETWORK'

      alert(
        serverMessage ||
          (isNetworkError
            ? 'Tidak bisa menghubungi API login. Cek backend, env, dan routing /api.'
            : 'Login gagal. Periksa kembali email/password Anda.')
      )
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#1b120d] font-['Fredoka'] overflow-hidden relative">
      {/* SISI KIRI: FORM LOGIN */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 md:px-20 lg:px-32">
        {/* Brand/Logo Section */}
        <Link to="/" className="mb-12 flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
          <img
            src="/Logo Putih.png"
            alt="Logo Warung Kopi"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-[#fff3ec] leading-tight tracking-tight">
            Halo, <br /> Selamat Datang
          </h1>
          <p className="mt-3 text-base text-[#d7cdc7] font-reguler">
            Hey, Selamat datang di kopi favoritmu di Warung Kopi.
          </p>
        </div>

        {notice ? (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-100">
            {notice}
          </div>
        ) : null}

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
              className="rounded-2xl border-white/10 bg-white/5 py-4 !text-white placeholder:text-gray-500 focus:border-[#e39b4f] focus:ring-[#e39b4f]"
            />
            <AuthField
              icon="lock"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              name="password"
              className="rounded-2xl border-white/10 bg-white/5 py-4 !text-white placeholder:text-gray-500 focus:border-[#e39b4f] focus:ring-[#e39b4f]"
            />
          </div>

          <div className="flex items-center justify-between text-sm font-medium">
            <label className="flex items-center gap-2 cursor-pointer text-[#d7cdc7]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#e39b4f] focus:ring-[#e39b4f]"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-regular !text-[#f5cda5] hover:underline">
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-4 w-full md:w-fit rounded-2xl bg-[#f5cda5] px-12 py-4 font-bold text-black shadow-lg shadow-orange-900/20 transition-all hover:scale-105 hover:brightness-105 active:scale-95"
          >
            Masuk
          </button>
        </form>

        <p className="mt-12 text-sm text-[#c6c6c6] font-medium">
          Belum Punya Akun? {' '}
          <Link to="/register" className="font-bold !text-[#ffa748] hover:underline">
            Register
          </Link>
        </p>
      </div>

      {/* SISI KANAN: BACKGROUND GAMBAR DENGAN OVERLAY */}
      <div className="hidden h-full w-1/2 p-4 md:block">
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] flex items-center justify-center bg-[#1b120d]">
          <img
            src="/Gambar_Login.jpg"
            alt="Background Login"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
