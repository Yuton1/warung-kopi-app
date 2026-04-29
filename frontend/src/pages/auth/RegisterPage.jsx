import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthShell, { AuthField } from './AuthShell'
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
      name: fullName || email.split('@')[0] || 'Pelanggan Baru',
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
      city: 'Bandung',
    })

    window.dispatchEvent(new Event('warungkopi-state-changed'))
    navigate('/akun', { replace: true })
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="Daftar untuk menyimpan preferensi, alamat, dan riwayat pemesanan."
      linkText="Masuk"
      linkTo="/login"
      footerText="Setelah register, kamu bisa lanjut ke akun untuk melengkapi profil pelanggan."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AuthField
          icon="user"
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
          autoComplete="name"
          name="fullName"
        />
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
          autoComplete="new-password"
          name="password"
        />

        <button
          type="submit"
          className="mt-2 rounded-2xl bg-[#e39b4f] px-4 py-3 font-bold text-[#1b120d] shadow-[0_14px_30px_rgba(227,155,79,0.25)] transition hover:brightness-105"
        >
          Register
        </button>
      </form>
    </AuthShell>
  )
}

export default RegisterPage
