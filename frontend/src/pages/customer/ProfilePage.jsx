import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, LogOut, Sparkles, UserRound, Loader2 } from 'lucide-react'
import { STORAGE_KEYS, readStoredValue, writeStoredValue } from '../../data/customerStorage'
import MembershipCard from './ProfilePage/MembershipCard'
import Profile from './ProfilePage/Profile'
import SavedAddresses from './ProfilePage/SavedAddresses'
import ShippingAddress from './ProfilePage/ShippingAddress'
import UserIdentity from './ProfilePage/UserIdentity'

const defaultAccount = {
  mode: 'login',
  name: '',
  email: '',
  phone: '',
  address: '',
  city: 'Bandung',
}

const defaultLoyalty = {
  points: 0,
  rewardsUsed: 0,
  totalOrders: 0,
  memberSince: '',
  memberId: '',
  validThrough: '',
  tier: 'Bronze',
}

const normalizeText = (value) => String(value ?? '').trim()

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const initialsFromName = (name) => {
  const parts = normalizeText(name).split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'WK'
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

const tierFromPoints = (points) => {
  if (points >= 3000) return 'Platinum'
  if (points >= 1500) return 'Gold'
  if (points >= 500) return 'Silver'
  return 'Bronze'
}

const formatMemberSince = (dateString) => {
  if (!dateString) return 'Baru bergabung'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return normalizeText(dateString)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const [account, setAccount] = useState(() => readStoredValue(STORAGE_KEYS.account, defaultAccount))
  const [authUser, setAuthUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null))
  const [loyalty, setLoyalty] = useState(() => readStoredValue(STORAGE_KEYS.loyalty, defaultLoyalty))
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const syncStorage = () => {
      setAccount(readStoredValue(STORAGE_KEYS.account, defaultAccount))
      setAuthUser(readStoredValue(STORAGE_KEYS.auth, null))
      setLoyalty(readStoredValue(STORAGE_KEYS.loyalty, defaultLoyalty))
    }

    syncStorage()
    window.addEventListener('storage', syncStorage)
    window.addEventListener('warungkopi-state-changed', syncStorage)

    return () => {
      window.removeEventListener('storage', syncStorage)
      window.removeEventListener('warungkopi-state-changed', syncStorage)
    }
  }, [])

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

        if (!response.ok) {
          throw new Error('Gagal memuat profil dari database')
        }

        const data = await response.json()
        setProfile(data)

        const nextAccount = {
          ...account,
          mode: 'login',
          name: data.username || data.name || authUser?.name || '',
          email: data.email || authUser?.email || '',
          phone: data.phone || account?.phone || '',
        }
        setAccount(nextAccount)
        writeStoredValue(STORAGE_KEYS.account, nextAccount)

        const nextLoyalty = {
          points: parseNumber(data.points, 0),
          rewardsUsed: parseNumber(loyalty?.rewardsUsed, 0),
          totalOrders: parseNumber(data.total_orders, 0),
          memberSince: data.created_at || loyalty?.memberSince || '',
          memberId: data.id ? `WK-${String(data.id).padStart(4, '0')}` : loyalty?.memberId || '',
          validThrough: loyalty?.validThrough || '',
          tier: data.membership_status || data.membershipStatus || tierFromPoints(parseNumber(data.points, 0)),
        }
        setLoyalty(nextLoyalty)
        writeStoredValue(STORAGE_KEYS.loyalty, nextLoyalty)

        const nextSubscription = {
          status: parseNumber(data.points, 0) > 0 ? 'active' : 'inactive',
          isActive: parseNumber(data.points, 0) > 0,
          tier: data.membership_status || data.membershipStatus || tierFromPoints(parseNumber(data.points, 0)),
          points: parseNumber(data.points, 0),
          memberId: data.id ? `WK-${String(data.id).padStart(4, '0')}` : '',
        }
        writeStoredValue(STORAGE_KEYS.subscription, nextSubscription)
      } catch (error) {
        console.error('Gagal sinkronisasi data profil:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [authUser?.email, navigate])

  const displayName = normalizeText(profile?.username || profile?.name || authUser?.name || account?.name || 'Tamu Warung Kopi')
  const displayEmail = normalizeText(profile?.email || authUser?.email || account?.email || 'Belum login')
  const displayPhone = normalizeText(profile?.phone || account?.phone || '-')
  const displayAddress = normalizeText(
    account?.address || 'Jl. Raya Tlogomas No. 246, Kec. Lowokwaru, Kota Malang'
  )

  const loyaltyPoints = parseNumber(profile?.points ?? loyalty?.points, defaultLoyalty.points)
  const memberTier = profile?.membership_status || profile?.membershipStatus || loyalty?.tier || tierFromPoints(loyaltyPoints)
  const memberCode = normalizeText(profile?.id ? `WK-${String(profile.id).padStart(4, '0')}` : loyalty?.memberId || defaultLoyalty.memberId)
  const memberSince = profile?.created_at ? formatMemberSince(profile.created_at) : normalizeText(loyalty?.memberSince || defaultLoyalty.memberSince)
  const validThrough = normalizeText(loyalty?.validThrough || defaultLoyalty.validThrough)
  const rewardsUsed = parseNumber(loyalty?.rewardsUsed, defaultLoyalty.rewardsUsed)
  const totalOrders = parseNumber(profile?.total_orders ?? loyalty?.totalOrders, defaultLoyalty.totalOrders)

  const membership = useMemo(
    () => ({
      name: displayName,
      tier: memberTier,
      memberCode,
      memberSince,
      validThrough,
      points: loyaltyPoints,
      pointsTarget: Math.max(loyaltyPoints + 910, 3250),
    }),
    [displayName, loyaltyPoints, memberCode, memberSince, memberTier, validThrough]
  )

  const stats = useMemo(
    () => [
      { value: totalOrders, label: 'Total Orders' },
      { value: loyaltyPoints, label: 'Loyalty Points' },
      { value: rewardsUsed, label: 'Rewards Used' },
    ],
    [loyaltyPoints, rewardsUsed, totalOrders]
  )

  const addresses = useMemo(
    () => [
      {
        id: 'home',
        label: 'Home',
        type: 'home',
        default: true,
        address:
          displayAddress ||
          'Jl. Raya Tlogomas No. 246, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144',
        phone: displayPhone,
      },
      {
        id: 'campus',
        label: 'Campus',
        type: 'office',
        address: 'Universitas Muhammadiyah Malang, Jl. Raya Tlogomas No. 246, Gedung Kuliah Bersama',
        phone: displayPhone,
      },
      {
        id: 'kost',
        label: 'Kost',
        type: 'other',
        address: 'Kost Griya Mahasiswa, Jl. Mertojoyo Blk. B No. 12, Merjosari, Lowokwaru',
        phone: displayPhone,
      },
    ],
    [displayAddress, displayPhone]
  )

  const shippingOrder = useMemo(
    () => ({
      id: 'BRW-2847',
      status: 'In Transit',
      title: 'Order aktif',
      recipient: `${displayName} - Home`,
      address: displayAddress,
      phone: displayPhone,
      step: 2,
    }),
    [displayAddress, displayName, displayPhone]
  )

  const handleSaveProfile = async ({ username, email, phone }) => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.id,
          email: email || profile?.email || authUser?.email,
          username,
          phone,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData?.message || responseData?.error || 'Gagal memperbarui profil')
      }

      const updatedProfile = responseData.user || responseData
      setProfile(updatedProfile)

      const nextAuth = {
        ...(authUser || {}),
        name: updatedProfile.username || updatedProfile.name || username,
        email: updatedProfile.email || email,
      }
      setAuthUser(nextAuth)
      writeStoredValue(STORAGE_KEYS.auth, nextAuth)

      const nextAccount = {
        ...(account || defaultAccount),
        mode: 'login',
        name: updatedProfile.username || updatedProfile.name || username,
        email: updatedProfile.email || email,
        phone: updatedProfile.phone || phone || '',
      }
      setAccount(nextAccount)
      writeStoredValue(STORAGE_KEYS.account, nextAccount)

      const nextLoyalty = {
        ...(loyalty || defaultLoyalty),
        points: parseNumber(updatedProfile.points, loyaltyPoints),
        totalOrders: parseNumber(updatedProfile.total_orders, totalOrders),
        memberSince: updatedProfile.created_at || loyalty?.memberSince || '',
        memberId: updatedProfile.id ? `WK-${String(updatedProfile.id).padStart(4, '0')}` : memberCode,
        tier: updatedProfile.membership_status || updatedProfile.membershipStatus || memberTier,
      }
      setLoyalty(nextLoyalty)
      writeStoredValue(STORAGE_KEYS.loyalty, nextLoyalty)

      window.dispatchEvent(new Event('warungkopi-state-changed'))
    } catch (error) {
      console.error('Gagal memperbarui profil pelanggan:', error)
      throw error
    }
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.auth)
      window.localStorage.removeItem(STORAGE_KEYS.account)
      window.localStorage.removeItem(STORAGE_KEYS.loyalty)
      window.localStorage.removeItem(STORAGE_KEYS.subscription)
      window.dispatchEvent(new Event('warungkopi-state-changed'))
    }
    setAuthUser(null)
    setAccount(defaultAccount)
    setLoyalty(defaultLoyalty)
    setProfile(null)
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2 bg-[#F8F9FA] font-['Fredoka']">
        <Loader2 className="h-6 w-6 animate-spin text-[#2c1b0e]" />
        <span className="font-semibold text-[#4b3729]">Menyelaraskan profil dengan server...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['Fredoka'] pb-12">
      <section className="screen-hero grid grid-cols-1 items-center gap-8 rounded-b-[3rem] bg-[#2c1b0e] p-8 text-white shadow-md lg:grid-cols-2 lg:p-12">
        <div className="flex flex-col justify-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Akun Saya</span>
          <h1 className="text-3xl font-extrabold leading-tight lg:text-4xl">
            Profil, membership, dan alamat pelanggan dalam satu tempat.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-gray-300">
            Halaman ini sekarang mengambil identitas pelanggan langsung dari TiDB, jadi perubahan nama, email,
            dan nomor telepon akan tersimpan ke database.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold transition-all hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke menu
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-md">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
            Akses cepat
          </span>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black tracking-wider text-white">
              {initialsFromName(displayName)}
            </div>
            <div className="min-w-0">
              <strong className="block truncate text-2xl leading-tight">{displayName}</strong>
              <p className="truncate text-sm text-white/70">{displayEmail}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold text-amber-300">
              <Crown className="h-4 w-4" />
              {memberTier} Member
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold text-orange-300">
              <Sparkles className="h-4 w-4" />
              Since {memberSince}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/10 p-3 text-center">
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/50">{stat.label}</p>
                <strong className="mt-1 block text-base font-bold">{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Status</p>
                <strong className="text-sm">Profil terhubung dengan database</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto mt-10 max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <UserIdentity
            profile={profile || { username: displayName, email: displayEmail, phone: displayPhone, membershipStatus: memberTier }}
            loading={false}
            onSave={handleSaveProfile}
          />

          <MembershipCard membership={membership} />

          <article className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#2c1b0e] mb-1">Alamat Utama</h3>
              <p className="text-xs text-gray-400 mb-4">Lokasi pengiriman kopi takeaway/delivery</p>
              <div className="p-4 bg-[#f8f1e8] rounded-2xl text-sm font-medium text-[#4b3729]">
                {displayAddress || 'Belum ada alamat utama yang disimpan.'}
              </div>
            </div>
            <button className="mt-4 w-full rounded-xl border border-dashed border-[#6b4a34] py-2.5 text-xs font-bold text-[#6b4a34] transition-all hover:bg-[#f8f1e8]/40">
              Kelola Alamat
            </button>
          </article>
        </div>

        <section className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <SavedAddresses addresses={addresses} />
          <ShippingAddress order={shippingOrder} />
        </section>

        <section className="metrics-row mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="metric-card">
            <span>Email aktif</span>
            <strong>{displayEmail}</strong>
          </article>
          <article className="metric-card">
            <span>Status akun</span>
            <strong>{memberTier} Member</strong>
          </article>
          <article className="metric-card">
            <span>Alamat tersimpan</span>
            <strong>{displayAddress ? 'Ada' : 'Belum ada'}</strong>
          </article>
        </section>
      </main>
    </div>
  )
}

export default ProfilePage
