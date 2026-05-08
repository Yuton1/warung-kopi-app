import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
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
  points: 2340,
  rewardsUsed: 12,
  totalOrders: 47,
  memberSince: 'Jan 2024',
  memberId: '4728',
  validThrough: 'Dec 2025',
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

const ProfilePage = () => {
  const [account, setAccount] = useState(() => readStoredValue(STORAGE_KEYS.account, defaultAccount))
  const [authUser, setAuthUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null))
  const [loyalty, setLoyalty] = useState(() => readStoredValue(STORAGE_KEYS.loyalty, defaultLoyalty))

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

  const displayName = normalizeText(authUser?.name || account?.name || 'Tamu Warung Kopi')
  const displayEmail = normalizeText(authUser?.email || account?.email || 'Belum login')
  const displayPhone = normalizeText(account?.phone || '+62 812 3456 7890')
  const displayAddress = normalizeText(
    account?.address || 'Jl. Raya Tlogomas No. 246, Kec. Lowokwaru, Kota Malang'
  )
  const displayCity = normalizeText(account?.city || 'Bandung')

  const loyaltyPoints = parseNumber(loyalty?.points, defaultLoyalty.points)
  const memberTier = loyalty?.tier || tierFromPoints(loyaltyPoints)
  const memberCode = normalizeText(loyalty?.memberId || defaultLoyalty.memberId)
  const memberSince = normalizeText(loyalty?.memberSince || defaultLoyalty.memberSince)
  const validThrough = normalizeText(loyalty?.validThrough || defaultLoyalty.validThrough)
  const rewardsUsed = parseNumber(loyalty?.rewardsUsed, defaultLoyalty.rewardsUsed)
  const totalOrders = parseNumber(loyalty?.totalOrders, defaultLoyalty.totalOrders)

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

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.auth)
      window.dispatchEvent(new Event('warungkopi-state-changed'))
    }
    setAuthUser(null)
  }

  return (
    <div className="screen-shell">
      <Profile
        name={displayName}
        email={displayEmail}
        tier={memberTier}
        memberSince={memberSince}
        stats={stats}
        initials={initialsFromName(displayName)}
        isLoggedIn={Boolean(authUser?.email)}
        onLogout={handleLogout}
      />

      <section className="feature-grid">
        <UserIdentity
          name={displayName}
          email={displayEmail}
          phone={displayPhone}
          status={memberTier}
        />

        <MembershipCard membership={membership} />
      </section>

      <section className="contact-grid">
        <SavedAddresses addresses={addresses} />
        <ShippingAddress order={shippingOrder} />
      </section>

      <section className="metrics-row">
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
    </div>
  )
}

export default ProfilePage
