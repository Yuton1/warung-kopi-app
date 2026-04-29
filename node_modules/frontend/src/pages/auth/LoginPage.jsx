import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { AuthField } from './AuthShell'
import { STORAGE_KEYS, writeStoredValue } from '../../data/customerStorage'

const LoginPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      // ===============================
      // LOGIN VIA BACKEND (VERSI REVISI)
      // ===============================

      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password
        }
      );

      const { user, token } = response.data;

      const userRole = user.role;

      const authUser = {
        name: user.username,
        role: userRole,
        email: user.email,
        mode: 'login',
        loggedInAt: new Date().toISOString(),
      }

      // simpan data user
      writeStoredValue(STORAGE_KEYS.auth, authUser);

      writeStoredValue(STORAGE_KEYS.account, {
        ...authUser,
        phone: '',
        address: '',
        city: 'Malang',
      });

      // simpan token
      localStorage.setItem("token", token);

      window.dispatchEvent(
        new Event('warungkopi-state-changed')
      )

      // navigasi berdasarkan role
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      }
      else if (userRole === 'barista') {
        navigate('/barista', { replace: true });
      }
      else {
        navigate('/', { replace: true });
      }

    } catch (err) {

      // ==================================
      // FALLBACK LOGIN (VERSI SEBELUM REVISI)
      // ==================================

      console.warn(
        "API login gagal, pakai fallback logic:",
        err
      );

      let userRole = 'customer';

      if (email === 'mohahsanmalik1@gmail.com') {
        userRole = 'admin';
      }
      else if (email.includes('barista')) {
        userRole = 'barista';
      }

      const authUser = {
        name: email.split('@')[0] || 'User',
        email: email,
        role: userRole,
        mode: 'login',
        loggedInAt: new Date().toISOString(),
      }

      writeStoredValue(STORAGE_KEYS.auth, authUser)

      writeStoredValue(STORAGE_KEYS.account, {
        ...authUser,
        phone: '',
        address: '',
        city: 'Malang',
      })

      window.dispatchEvent(
        new Event('warungkopi-state-changed')
      )

      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      }
      else if (userRole === 'barista') {
        navigate('/barista', { replace: true });
      }
      else {
        navigate('/', { replace: true });
      }

    }
  }

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">

      {/* FORM LOGIN */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 md:px-20 lg:px-32">

        {/* Logo */}
        <div className="mb-12 flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[#1b120d]" />
          <span className="text-xl font-bold tracking-tight text-[#1b120d]">
            WarungKopi
          </span>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#1b120d] leading-tight">
            Halo, <br /> Welcome Back
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Hey, welcome back to your favorite coffee place.
          </p>
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
        >

          <div className="space-y-4">

            <AuthField
              icon="mail"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Email"
              autoComplete="email"
              name="email"
            />

            <AuthField
              icon="lock"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Password"
              autoComplete="current-password"
              name="password"
            />

          </div>

          {/* Remember */}
          <div className="flex items-center justify-between text-xs">

            <label className="flex items-center gap-2 cursor-pointer text-gray-600">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              Remember me

            </label>

            <Link
              to="/forgot-password"
              className="font-semibold text-gray-500 hover:text-[#e39b4f]"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            className="mt-4 w-fit rounded-xl bg-[#e39b4f] px-10 py-3 font-bold text-white"
          >
            Sign In
          </button>

        </form>

        <p className="mt-12 text-xs text-gray-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-[#e39b4f]"
          >
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  )
}

export default LoginPage