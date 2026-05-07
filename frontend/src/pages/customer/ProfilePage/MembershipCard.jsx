import { Crown, Gift, Percent, Star, Truck, Zap } from 'lucide-react'

const MembershipCard = ({ membership }) => {
  const percent = Math.min(100, Math.round((membership.points / membership.pointsTarget) * 100))

  return (
    <article className="surface-card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon gold">
            <Crown className="h-[22px] w-[22px]" />
          </div>
          <div>
            <h3>Membership Card</h3>
            <p>Your digital coffee card</p>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] bg-gradient-to-br from-[#5b3927] via-[#8f6342] to-[#b88659] p-5 text-[#fff7ef] shadow-[0_16px_32px_rgba(45,25,15,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">Gold Membership</p>
            <h4 className="mt-1 text-2xl font-black">{membership.name}</h4>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/65">Member ID</p>
            <strong className="block text-sm">{membership.memberCode}</strong>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl bg-white/10 p-3">
            <span className="block text-[10px] uppercase tracking-[0.16em] text-white/60">Member Since</span>
            <strong className="mt-1 block">{membership.memberSince}</strong>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <span className="block text-[10px] uppercase tracking-[0.16em] text-white/60">Valid Through</span>
            <strong className="mt-1 block">{membership.validThrough}</strong>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <span className="block text-[10px] uppercase tracking-[0.16em] text-white/60">Points</span>
            <strong className="mt-1 block">{membership.points}</strong>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm text-white/80">
            <span>Membership Progress</span>
            <span>
              {membership.points} / {membership.pointsTarget} pts
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-[#f7c96d]" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-white/70">
            <span>{membership.tier} Member</span>
            <span>{membership.pointsTarget - membership.points} pts to next tier</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl bg-[#f8f1e8] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff] text-[#a67b53]">
            <Percent className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-[#4b3729]">10% Off All Drinks</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#f8f1e8] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff] text-[#a67b53]">
            <Truck className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-[#4b3729]">Free Delivery</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#f8f1e8] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff] text-[#a67b53]">
            <Gift className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-[#4b3729]">Birthday Reward</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#f8f1e8] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff] text-[#a67b53]">
            <Zap className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-[#4b3729]">Priority Queue</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-[#8c7661]">
        <Star className="h-4 w-4 text-[#c9a96e]" />
        {membership.tier} tier is active on your account
      </div>
    </article>
  )
}

export default MembershipCard
