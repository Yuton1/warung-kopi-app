import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { STORAGE_KEYS, readStoredValue, writeStoredValue } from '../../data/customerStorage'
import Profile from './ProfilePage/Profile'
import UserIdentity from './ProfilePage/UserIdentity'

const defaultAccount = { mode: 'login', name: '', email: '', phone: '', address: '', city: 'Malang' }
const defaultLoyalty = { points: 0, rewardsUsed: 0, totalOrders: 0, memberSince: '', memberId: '', tier: 'Bronze' }

const normalizeText = (value) => String(value ?? '').trim()
const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const [account, setAccount] = useState(() => readStoredValue(STORAGE_KEYS.account, defaultAccount))
  const [authUser, setAuthUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null))
  const [loyalty, setLoyalty] = useState(() => readStoredValue(STORAGE_KEYS.loyalty, defaultLoyalty))
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sinkronisasi State jika ada perubahan di LocalStorage
  useEffect(() => {
    const syncStorage = () => {
      setAccount(readStoredValue(STORAGE_KEYS.account, defaultAccount))
      setAuthUser(readStoredValue(STORAGE_KEYS.auth, null))
      setLoyalty(readStoredValue(STORAGE_KEYS.loyalty, defaultLoyalty))
    }
    window.addEventListener('storage', syncStorage)
    window.addEventListener('warungkopi-state-changed', syncStorage)
    return () => {
      window.removeEventListener('storage', syncStorage)
      window.removeEventListener('warungkopi-state-changed', syncStorage)
    }
  }, [])

  // Mengambil data terupdate dari basis data TiDB Server
  useEffect(() => {
    const loadProfile = async () => {
      const email = normalizeText(authUser?.email)
      if (!email) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/users/me?email=${encodeURIComponent(email)}`)

        if (response.status === 401 || response.status === 404) {
          window.localStorage.removeItem(STORAGE_KEYS.auth)
          window.dispatchEvent(new Event('warungkopi-state-changed'))
          navigate('/login', { replace: true })
          return
        }

        if (!response.ok) throw new Error('Gagal memuat profil')

        const data = await response.json()
        setProfile(data)

        // Sinkronisasi data akun ke storage lokal
        const nextAccount = {
          ...account,
          name: data.username || data.name || authUser?.name || '',
          email: data.email || authUser?.email || '',
          phone: data.phone || account?.phone || '',
        }
        setAccount(nextAccount)
        writeStoredValue(STORAGE_KEYS.account, nextAccount)

        // Sinkronisasi metrik loyalitas
        const nextLoyalty = {
          points: parseNumber(data.points, 0),
          rewardsUsed: parseNumber(loyalty?.rewardsUsed, 0),
          totalOrders: parseNumber(data.total_orders, 0),
          memberSince: data.created_at || loyalty?.memberSince || '',
          memberId: data.id ? `WK-${String(data.id).padStart(4, '0')}` : loyalty?.memberId || '',
          tier: data.membership_status || data.membershipStatus || 'Bronze',
        }
        setLoyalty(nextLoyalty)
        writeStoredValue(STORAGE_KEYS.loyalty, nextLoyalty)

      } catch (error) {
        console.error('Gagal sinkronisasi data profil:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [authUser?.email, navigate])

  // Normalisasi Data untuk didistribusikan ke komponen UI
  const displayName = normalizeText(profile?.username || authUser?.username || account?.name || 'Tamu Warung Kopi')
  const displayEmail = normalizeText(profile?.email || authUser?.email || account?.email || 'Belum login')
  const displayPhone = normalizeText(profile?.phone || account?.phone || '-')
  const displayAddress = normalizeText(account?.address || 'Jl. Raya Tlogomas No. 246, Kota Malang')

  const points = parseNumber(profile?.points ?? loyalty?.points, 0)
  const memberTier = profile?.membership_status || profile?.membershipStatus || loyalty?.tier || 'Bronze'
  const totalOrders = parseNumber(profile?.total_orders ?? loyalty?.totalOrders, 0)

  // Inisial untuk Avatar lingkaran profil
  const initials = useMemo(() => {
    const parts = displayName.split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'WK'
    return parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('')
  }, [displayName])

  // Mempersiapkan array statistik terpadu untuk komponen Profile kustom kita
  const statsArray = useMemo(() => [
    { value: totalOrders, label: 'Total Pesanan' },
    { value: points, label: 'Poin Toko' },
    { value: loyalty.rewardsUsed, label: 'Reward Ditukar' }
  ], [totalOrders, points, loyalty.rewardsUsed])

  const handleSaveProfile = async ({ username, email, phone }) => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.id, email, username, phone }),
      })

      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData?.message || 'Gagal memperbarui')

      const updated = responseData.user || responseData
      setProfile(updated)

      // Segarkan status auth lokal
      const nextAuth = { ...authUser, username: updated.username, name: updated.username, email: updated.email }
      setAuthUser(nextAuth)
      writeStoredValue(STORAGE_KEYS.auth, nextAuth)
      window.dispatchEvent(new Event('warungkopi-state-changed'))
    } catch (error) {
      console.error('Gagal update profile:', error)
      throw error
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEYS.auth)
    window.localStorage.removeItem(STORAGE_KEYS.account)
    window.localStorage.removeItem(STORAGE_KEYS.loyalty)
    window.localStorage.removeItem(STORAGE_KEYS.subscription)
    window.dispatchEvent(new Event('warungkopi-state-changed'))
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center gap-3 bg-[#F8F9FA] font-['Fredoka']">
        <Loader2 className="h-7 w-7 animate-spin text-[#2c1b0e]" />
        <span className="font-bold text-[#4b3729]">Menghubungkan ke server TiDB...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['Fredoka'] p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. SEKTOR HEADER: Menggunakan Komponen Utama Profile Cokelat Premium */}
      <Profile
        username={displayName}
        email={displayEmail}
        membershipStatus={memberTier}
        created_at={profile?.created_at || loyalty.memberSince}
        points={points}
        stats={statsArray}
        initials={initials}
        isLoggedIn={!!authUser}
        onLogout={handleLogout}
      />

      {/* 2. SEKTOR UTAMA: Form Edit Data Akun & Detail Alamat Fisik */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Kolom Kiri: Form Interaktif UserIdentity */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <UserIdentity
            profile={{ username: displayName, email: displayEmail, phone: displayPhone, membershipStatus: memberTier }}
            loading={false}
            onSave={handleSaveProfile}
          />
        </div>

        {/* Kolom Kanan: Detail Informasi Pengiriman Barang */}
        <div className="lg:col-span-5 space-y-6">
          <article className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between h-full">
            <div>
              <h3 className="font-bold text-xl text-[#2c1b0e] mb-1">Alamat Pengiriman Utama</h3>
              <p className="text-xs text-gray-400 mb-5">Lokasi default untuk kurir mengantar kopi pesanan Anda.</p>
              
              <div className="p-5 bg-[#fcf8f4] border border-[#f0e2d5] rounded-2xl text-sm font-semibold text-[#4b3729] leading-relaxed">
                {displayAddress}
              </div>
            </div>
            
            <button className="mt-6 w-full rounded-xl border border-dashed border-[#b08968] py-3 text-xs font-bold text-[#b08968] bg-transparent transition-all hover:bg-[#fcf8f4]">
              Ubah Alamat Pengiriman
            </button>
          </article>
        </div>

      </main>
    </div>
  )
}

export default ProfilePage