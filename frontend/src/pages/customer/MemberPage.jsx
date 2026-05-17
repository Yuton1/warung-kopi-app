import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Crown, ExternalLink, Sparkles, Star, Ticket, Wallet } from 'lucide-react'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
import JoinSection from './MemberPage/JoinMember/JoinSection'
import ProfileCard from './MemberPage/ActiveMember/ProfileCard'
import BenefitList from './MemberPage/components/BenefitList'

const defaultAccount = {
  name: '',
  email: '',
}

const defaultMembership = {
  points: 0,
  rewardsUsed: 0,
  totalOrders: 0,
  memberSince: '',
  memberId: '',
  validThrough: '',
  tier: '',
}

const normalizeText = (value) => String(value ?? '').trim()

const formatMemberSince = (value) => {
  if (!value) return 'Baru bergabung'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return normalizeText(value)

  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
}

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const tierFromPoints = (points) => {
  if (points >= 3000) return 'Platinum'
  if (points >= 1500) return 'Gold'
  if (points >= 500) return 'Silver'
  return 'Bronze'
}

const MemberPage = () => {
  const [authUser, setAuthUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null))
  const [account, setAccount] = useState(() => readStoredValue(STORAGE_KEYS.account, defaultAccount))
  const [loyalty, setLoyalty] = useState(() => readStoredValue(STORAGE_KEYS.loyalty, null))
  const [subscription, setSubscription] = useState(() => readStoredValue(STORAGE_KEYS.subscription, null))

  useEffect(() => {
    const syncStorage = () => {
      setAuthUser(readStoredValue(STORAGE_KEYS.auth, null))
      setAccount(readStoredValue(STORAGE_KEYS.account, defaultAccount))
      setLoyalty(readStoredValue(STORAGE_KEYS.loyalty, null))
      setSubscription(readStoredValue(STORAGE_KEYS.subscription, null))
    }

    syncStorage()
    window.addEventListener('storage', syncStorage)
    window.addEventListener('warungkopi-state-changed', syncStorage)

    return () => {
      window.removeEventListener('storage', syncStorage)
      window.removeEventListener('warungkopi-state-changed', syncStorage)
    }
  }, [])

  const membershipSource = subscription || loyalty || null
  const isMember = Boolean(
    membershipSource &&
      (
        membershipSource?.status === 'active' ||
        membershipSource?.isActive === true ||
        membershipSource?.is_member === true ||
        membershipSource?.memberId ||
        membershipSource?.planId ||
        membershipSource?.points > 0
      )
  )
  const displayName = normalizeText(authUser?.username || authUser?.name || account?.name || 'Tamu Warung Kopi')
  const displayEmail = normalizeText(authUser?.email || account?.email || 'Belum login')
  const points = parseNumber(membershipSource?.points, defaultMembership.points)
  const memberTier = membershipSource?.tier || tierFromPoints(points)
  const memberSince = formatMemberSince(
    membershipSource?.created_at ||
      authUser?.created_at ||
      membershipSource?.memberSince ||
      membershipSource?.startedAt ||
      ''
  )
  const validThrough = normalizeText(membershipSource?.validThrough || membershipSource?.expiresAt || '')
  const memberCode = normalizeText(membershipSource?.memberId || membershipSource?.memberCode || '')

  const memberInfo = useMemo(
    () => ({
      name: displayName,
      email: displayEmail,
      tier: memberTier,
      points,
      pointsTarget: Math.max(points + 910, 3250),
      totalOrders: parseNumber(membershipSource?.totalOrders, defaultMembership.totalOrders),
      rewardsUsed: parseNumber(membershipSource?.rewardsUsed, defaultMembership.rewardsUsed),
      memberSince,
      validThrough: validThrough || 'Tidak ada tanggal kedaluwarsa',
      memberCode: memberCode || 'WK-NEW',
      initials: displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || 'WK',
    }),
    [
      displayEmail,
      displayName,
      points,
      memberCode,
      memberSince,
      memberTier,
      membershipSource?.rewardsUsed,
      membershipSource?.totalOrders,
      validThrough,
    ]
  )

  const heroStats = useMemo(
    () => [
      { label: 'Total Orders', value: memberInfo.totalOrders, icon: Wallet },
      { label: 'Points', value: memberInfo.points, icon: Star },
      { label: 'Rewards Used', value: memberInfo.rewardsUsed, icon: Ticket },
    ],
    [memberInfo.points, memberInfo.rewardsUsed, memberInfo.totalOrders]
  )

  return (
    <div className="screen-shell">
      {isMember ? (
        <section className="screen-hero">
          <div>
            <span className="eyebrow">Member Area</span>
            <h1>Selamat datang kembali, {memberInfo.name}.</h1>
            <p>
              Halaman ini merangkum status member, progress poin, dan keuntungan eksklusif yang aktif di akun
              kamu.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/pesanan" className="btn btn-primary">
                <ExternalLink className="h-4 w-4" />
                Lihat Pesanan
              </Link>
              <Link to="/promo" className="btn btn-secondary">
                <Sparkles className="h-4 w-4" />
                Lihat Promo
              </Link>
            </div>
          </div>

          <div className="screen-hero__card">
            <span className="eyebrow">Member aktif</span>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black text-white">
                {memberInfo.initials}
              </div>
              <div className="min-w-0">
                <strong className="block truncate text-2xl leading-tight">{memberInfo.name}</strong>
                <p className="truncate text-sm">{memberInfo.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-white/85">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold">
                <Crown className="h-4 w-4" />
                {memberInfo.tier} Member
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold">
                <Star className="h-4 w-4" />
                Since {memberInfo.memberSince}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {heroStats.map((stat) => {
                const Icon = stat.icon

                return (
                  <div key={stat.label} className="rounded-2xl bg-white/10 p-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/60">
                      <Icon className="h-3.5 w-3.5" />
                      {stat.label}
                    </div>
                    <strong className="mt-1 block text-lg">{stat.value}</strong>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          <JoinSection />

          <section className="rounded-[28px] border border-[#e1cdbb] bg-[#fff8ef] px-6 py-5 shadow-[0_16px_40px_rgba(45,25,15,0.06)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="eyebrow">Belum jadi member</span>
                <h2 className="mt-2 text-2xl font-extrabold text-[#4a3728]">
                  Kamu belum terdaftar sebagai member aktif.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6f6257]">
                  Untuk melihat kartu member, poin, dan benefit aktif, daftar dulu sebagai member atau masuk jika
                  akunmu sudah punya data membership.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-primary">
                  Gabung Member
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Masuk
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}

      {isMember ? (
        <div className="mt-6">
          <ProfileCard member={memberInfo} />
        </div>
      ) : null}

      <BenefitList />

      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-[#d9c0aa] bg-[#f9f1e6] px-5 py-4">
        <div>
          <span className="eyebrow">Membership Snapshot</span>
          <p className="mt-1 text-sm text-[#6f6257]">
            {isMember
              ? `Member code ${memberInfo.memberCode} aktif sampai ${memberInfo.validThrough}.`
              : 'Belum login. Masuk atau daftar untuk mengaktifkan member card.'}
          </p>
        </div>
        <Link to={isMember ? '/pesanan' : '/register'} className="btn btn-primary">
          {isMember ? 'Cek Pesanan' : 'Gabung Member'}
        </Link>
      </section>
    </div>
  )
}

export default MemberPage
