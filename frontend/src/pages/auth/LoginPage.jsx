import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthShell, { AuthField } from './AuthShell'
import { STORAGE_KEYS, writeStoredValue } from '../../data/customerStorage'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const authUser = {
      email,
      name: email.split('@')[0] || 'Pelanggan',
      mode: 'login',
      loggedInAt: new Date().toISOString(),
    }

    writeStoredValue(STORAGE_KEYS.auth, authUser)
    writeStoredValue(STORAGE_KEYS.account, {
      mode: 'login',
      name: authUser.name,
      email: authUser.email,
      phone: '',
      address: '',
      city: 'Bandung',
    })

    window.dispatchEvent(new Event('warungkopi-state-changed'))
    navigate('/', { replace: true })
  }

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Masuk untuk lanjut ke menu, pesanan, dan akun pelanggan."
      linkText="Daftar akun"
      linkTo="/register"
      footerText="Gunakan akun pelanggan untuk menjaga order, pre-order, dan profil tetap sinkron."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AuthField
          icon="mail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          autoComplete="email"
          name="email"
        />
        <AuthField
          icon="lock"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          name="password"
        />

        <button
          type="submit"
          className="mt-2 rounded-2xl bg-[#e39b4f] px-4 py-3 font-bold text-[#1b120d] shadow-[0_14px_30px_rgba(227,155,79,0.25)] transition hover:brightness-105"
        >
          Login
        </button>
      </form>
    </AuthShell>
  )
}

export default LoginPage
