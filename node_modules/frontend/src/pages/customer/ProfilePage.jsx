import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { STORAGE_KEYS, readStoredValue, writeStoredValue } from '../../data/customerStorage'

const defaultAccount = {
  mode: 'login',
  name: '',
  email: '',
  phone: '',
  address: '',
  city: 'Bandung',
}

const ProfilePage = () => {
  const [mode, setMode] = useState('login')
  const [account, setAccount] = useState(() => readStoredValue(STORAGE_KEYS.account, defaultAccount))
  const [authUser, setAuthUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null))
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.account, account)
  }, [account])

  useEffect(() => {
    setAuthUser(readStoredValue(STORAGE_KEYS.auth, null))
  }, [account?.email, mode])

  useEffect(() => {
    if (account?.mode) {
      setMode(account.mode)
    }
  }, [account?.mode])

  const handleChange = (field) => (event) => {
    setAccount((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextStatus = mode === 'register' ? 'Akun baru tersimpan' : 'Login frontend tersimpan'
    setStatus(nextStatus)
    setAccount((current) => ({
      ...current,
      mode,
    }))
    setPassword('')
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.auth)
      window.dispatchEvent(new Event('warungkopi-state-changed'))
    }
    setAuthUser(null)
    setStatus('Kamu sudah logout')
  }

  return (
    <div className="screen-shell">
      <section className="screen-hero">
        <div>
          <span className="eyebrow">Akun Saya</span>
          <h1>Profil, login, dan alamat pelanggan dalam satu tempat.</h1>
          <p>
            Bagian ini dibuat dulu untuk user agar proses checkout terasa personal. Saat backend auth siap,
            flow ini tinggal disambungkan tanpa mengubah tampilannya.
          </p>
        </div>

        <div className="screen-hero__card">
          <span className="eyebrow">Akses cepat</span>
          <strong>{authUser?.name || account.name || 'Tamu Warung Kopi'}</strong>
          <p>{authUser?.email || account.email || 'Belum login'}</p>
          <Link to="/" className="btn btn-secondary">
            Kembali ke menu
          </Link>
          {authUser ? (
            <button type="button" className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </section>

      <section className="feature-grid">
        <article className="surface-card">
          <div className="section-head section-head--tight">
            <div>
              <span className="eyebrow">Login / Register</span>
              <h2>{mode === 'register' ? 'Daftar akun baru' : 'Masuk ke akun saya'}</h2>
            </div>
          </div>

          <div className="mode-switch">
            <button type="button" className={`chip ${mode === 'login' ? 'is-active' : ''}`} onClick={() => setMode('login')}>
              Login
            </button>
            <button type="button" className={`chip ${mode === 'register' ? 'is-active' : ''}`} onClick={() => setMode('register')}>
              Register
            </button>
          </div>

          <form className="stack-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label className="field">
                <span>Nama lengkap</span>
                <input type="text" value={account.name} onChange={handleChange('name')} placeholder="Nama pelanggan" />
              </label>
            )}

            <label className="field">
              <span>Email</span>
              <input type="email" value={account.email} onChange={handleChange('email')} placeholder="nama@email.com" />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password frontend"
              />
            </label>

            {mode === 'register' && (
              <label className="field">
                <span>No. WhatsApp</span>
                <input type="tel" value={account.phone} onChange={handleChange('phone')} placeholder="08xxxxxxxxxx" />
              </label>
            )}

            <button type="submit" className="btn btn-primary">
              {mode === 'register' ? 'Daftar akun' : 'Masuk'}
            </button>
            {status ? <p className="hint-text">{status}</p> : null}
          </form>
        </article>

        <article className="surface-card">
          <div className="section-head section-head--tight">
            <div>
              <span className="eyebrow">Alamat Pengiriman</span>
              <h2>Atur profil pelanggan</h2>
            </div>
          </div>

          <form className="stack-form">
            <label className="field">
              <span>Nama tampilan</span>
              <input type="text" value={account.name} onChange={handleChange('name')} placeholder="Nama yang tampil di checkout" />
            </label>

            <label className="field">
              <span>Nomor telepon</span>
              <input type="tel" value={account.phone} onChange={handleChange('phone')} placeholder="08xxxxxxxxxx" />
            </label>

            <label className="field">
              <span>Alamat</span>
              <textarea
                rows="4"
                value={account.address}
                onChange={handleChange('address')}
                placeholder="Alamat lengkap untuk pengantaran atau pickup point"
              />
            </label>

            <label className="field">
              <span>Kota</span>
              <input type="text" value={account.city} onChange={handleChange('city')} placeholder="Bandung" />
            </label>

            <button type="button" className="btn btn-secondary" onClick={() => setStatus('Profil tersimpan di browser')}>
              Simpan profil
            </button>
          </form>
        </article>
      </section>

      <section className="metrics-row">
        <article className="metric-card">
          <span>Email aktif</span>
          <strong>{account.email || '-'}</strong>
        </article>
        <article className="metric-card">
          <span>Status akun</span>
          <strong>{mode === 'register' ? 'Siap daftar' : 'Siap login'}</strong>
        </article>
        <article className="metric-card">
          <span>Alamat tersimpan</span>
          <strong>{account.address ? 'Ada' : 'Belum ada'}</strong>
        </article>
      </section>
    </div>
  )
}

export default ProfilePage
