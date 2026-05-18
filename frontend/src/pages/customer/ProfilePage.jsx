import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { STORAGE_KEYS, readStoredValue, writeStoredValue } from '../../data/customerStorage'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'

// IMPORT SUB-KOMPONEN DARI FOLDER ProfilePage
import Profile from './ProfilePage/Profile'
import UserIdentity from './ProfilePage/UserIdentity'
import SavedAddresses from './ProfilePage/SavedAddresses'
import ShippingAddress from './ProfilePage/ShippingAddress'
import MembershipCard from './ProfilePage/MembershipCard'

const defaultAccount = { mode: 'login', name: '', email: '', phone: '', address: '', city: 'Malang' }
const defaultLoyalty = { points: 0, rewardsUsed: 0, totalOrders: 0, memberSince: '', memberId: '', tier: 'Bronze' }
const API_BASE_URL = getApiBaseUrl()

const normalizeText = (value) => String(value ?? '').trim()
const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const apiUrl = (path) => {
  if (!API_BASE_URL) return path
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const [account, setAccount] = useState(() => readStoredValue(STORAGE_KEYS.account, defaultAccount))
  const [authUser, setAuthUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null))
  const [loyalty, setLoyalty] = useState(() => readStoredValue(STORAGE_KEYS.loyalty, defaultLoyalty))
  const [profile, setProfile] = useState(null)
  
  // State untuk mengelola daftar alamat dari database TiDB
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingAddresses, setLoadingAddresses] = useState(false)

  // Sinkronisasi State jika ada perubahan status di LocalStorage aplikasi
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

  // Fungsi mengambil daftar alamat user dari API Backend
  const fetchAddresses = async (userId) => {
    if (!userId) return
    try {
      setLoadingAddresses(true)
      const response = await fetch(apiUrl(`/api/users/addresses?userId=${userId}`))
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error('Gagal memuat daftar alamat:', error)
    } finally {
      setLoadingAddresses(false)
    }
  }

  // Mengambil data terupdate profil pelanggan dari basis data TiDB Server
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
        const response = await fetch(apiUrl(`/api/users/me?email=${encodeURIComponent(email)}`))

        if (response.status === 401 || response.status === 404) {
          window.localStorage.removeItem(STORAGE_KEYS.auth)
          window.dispatchEvent(new Event('warungkopi-state-changed'))
          navigate('/login', { replace: true })
          return
        }

        if (!response.ok) throw new Error('Gagal memuat profil')

        const data = await response.json()
        setProfile(data)
        
        // Tarik data alamat setelah mendapatkan ID user
        if (data.id) {
          fetchAddresses(data.id)
        }

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

  // Cari alamat default untuk ditampilkan di card kanan atas
  const defaultAddressItem = useMemo(() => {
    const found = addresses.find(addr => addr.is_default === 1 || addr.is_default === true)
    if (found) return found.address
    return account?.address || 'Belum ada alamat utama yang disimpan.'
  }, [addresses, account?.address])

  const displayName = normalizeText(profile?.username || authUser?.username || account?.name || 'Tamu Warung Kopi')
  const displayEmail = normalizeText(profile?.email || authUser?.email || account?.email || 'Belum login')
  const displayPhone = normalizeText(profile?.phone || account?.phone || '-')

  const points = parseNumber(profile?.points ?? loyalty?.points, 0)
  const memberTier = profile?.membership_status || profile?.membershipStatus || loyalty?.tier || 'Bronze'
  const totalOrders = parseNumber(profile?.total_orders ?? loyalty?.totalOrders, 0)

  const initials = useMemo(() => {
    const parts = displayName.split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'WK'
    return parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('')
  }, [displayName])

  const statsArray = useMemo(() => [
    { value: totalOrders, label: 'Total Pesanan' },
    { value: points, label: 'Poin Toko' },
    { value: loyalty.rewardsUsed, label: 'Reward Ditukar' }
  ], [totalOrders, points, loyalty.rewardsUsed])

  const membershipData = useMemo(() => ({
    name: displayName,
    tier: memberTier,
    memberCode: profile?.id ? `WK-${String(profile.id).padStart(4, '0')}` : 'WK-0000',
    memberSince: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : 'Baru Bergabung',
    points: points,
    pointsTarget: 1000 // Batas target poin untuk progress bar UI
  }), [displayName, memberTier, profile, points])

  // Dummy data pesanan in-transit untuk sub-komponen ShippingAddress
  const currentShippingOrder = useMemo(() => ({
    id: 'WK-ORDER-992',
    status: 'In Transit',
    title: 'Pesanan Sedang Diantar Kurir',
    recipient: displayName,
    address: defaultAddressItem,
    phone: displayPhone,
    step: 2
  }), [displayName, defaultAddressItem, displayPhone])

  // ACTION HANDLERS INTERAKSI DATABASE
  const handleSaveProfile = async ({ username, email, phone }) => {
    try {
      const response = await fetch(apiUrl('/api/users/me'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.id, email, username, phone }),
      })
      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData?.message || 'Gagal memperbarui')

      const updated = responseData.user || responseData
      setProfile(updated)

      const nextAuth = { ...authUser, username: updated.username, name: updated.username, email: updated.email, phone: updated.phone }
      setAuthUser(nextAuth)
      writeStoredValue(STORAGE_KEYS.auth, nextAuth)
      window.dispatchEvent(new Event('warungkopi-state-changed'))
    } catch (error) {
      console.error('Gagal update profile:', error)
      throw error
    }
  }

  const handleAddAddress = async (addressForm) => {
    try {
      const response = await fetch(apiUrl('/api/users/addresses'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addressForm, userId: profile?.id })
      })
      if (!response.ok) throw new Error('Gagal menyimpan alamat baru')
      await fetchAddresses(profile?.id) // Refresh data alamat
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(apiUrl(`/api/users/addresses/${addressId}/default`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.id })
      })
      if (!response.ok) throw new Error('Gagal set alamat default')
      await fetchAddresses(profile?.id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(apiUrl(`/api/users/addresses/${addressId}`), {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Gagal menghapus alamat')
      await fetchAddresses(profile?.id)
    } catch (error) {
      console.error(error)
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
    <div className="min-h-screen font-['Fredoka'] space-y-8 w-full max-w-[1860px] mx-auto">
      
      {/* 1. SEKTOR HEADER: Banner Profile Cokelat Premium */}
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

      {/* 2. SEKTOR TENGAH: Form Identitas Pelanggan & Katalog Leveling Progress */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        <div className="lg:col-span-7">
          <UserIdentity
            profile={profile || { username: displayName, email: displayEmail, phone: displayPhone, points, membershipStatus: memberTier }}
            loading={false}
            onSave={handleSaveProfile}
          />
        </div>

        <div className="lg:col-span-5 h-full">
          <MembershipCard membership={membershipData} />
        </div>
      </main>

      {/* 3. SEKTOR BAWAH: Pengelolaan Alamat Tersimpan & Status Pengiriman Aktif */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        <div className="lg:col-span-7">
          <SavedAddresses 
            addresses={addresses}
            onAddAddress={handleAddAddress}
            onSetDefault={handleSetDefaultAddress}
            onDelete={handleDeleteAddress}
            loading={loadingAddresses}
          />
        </div>

        <div className="lg:col-span-5">
          <ShippingAddress order={currentShippingOrder} />
        </div>
      </section>

    </div>
  )
}

export default ProfilePage
