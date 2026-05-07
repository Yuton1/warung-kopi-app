import { useMemo } from 'react'
import { Crown, Gift, Percent, Sparkles, Star, Ticket, Truck, Zap } from 'lucide-react'

const formatPercent = (points, target) => {
  if (!target) return 0
  return Math.min(100, Math.round((points / target) * 100))
}

const ProfileCard = ({ member }) => {
  const progress = useMemo(
    () => formatPercent(member.points, member.pointsTarget),
    [member.points, member.pointsTarget]
  )
  const remaining = Math.max((member.pointsTarget || 0) - (member.points || 0), 0)

  return (
    <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <article className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#b08968] via-[#a77a56] to-[#8f6243] p-6 text-white shadow-[0_24px_60px_rgba(96,64,36,0.18)] md:p-8">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/6" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/6" />

        <div className="relative z-10">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-20 w-20 flex-none items-center justify-center rounded-[24px] bg-[#4a3728] text-3xl font-black shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              {member.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/65">Active Member</p>
              <h3 className="mt-1 truncate text-3xl font-black leading-tight">{member.name}</h3>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#ffb703]/18 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fff3d0]">
                <Crown className="h-3.5 w-3.5 text-[#ffb703]" />
                {member.tier} Member
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80">
                <Star className="h-4 w-4 text-[#ffb703]" />
                Loyalty Beans
              </span>
              <span className="text-sm font-black tracking-tight text-[#ffcf72]">
                {member.points} / {member.pointsTarget}
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ffb703] via-[#ffd166] to-[#fb8500]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/60">
              <span>{progress}% complete</span>
              <span>{remaining} points to next tier</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Total Orders', value: member.totalOrders, icon: Ticket },
              { label: 'Rewards Used', value: member.rewardsUsed, icon: Gift },
              { label: 'Since', value: member.memberSince, icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-2xl bg-white/8 p-3 text-center">
                  <Icon className="mx-auto h-4 w-4 text-[#ffb703]" />
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/55">{item.label}</p>
                  <strong className="mt-1 block text-sm">{item.value}</strong>
                </div>
              )
            })}
          </div>
        </div>
      </article>

      <article className="surface-card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon gold">
              <Sparkles className="h-[22px] w-[22px]" />
            </div>
            <div>
              <h3>Member Quota</h3>
              <p>Ringkasan manfaat member aktif</p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-[#f8f1e8] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#8c7661]">Member ID</p>
              <strong className="mt-1 block text-2xl text-[#4b3729]">{member.memberCode}</strong>
            </div>
            <div className="rounded-2xl bg-[#4a3728] px-4 py-2 text-right text-white">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">Valid Until</p>
              <strong className="block text-sm">{member.validThrough}</strong>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e4d3] text-[#a67b53]">
                  <Percent className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8c7661]">Discount</p>
                  <strong className="text-sm text-[#4b3729]">10% off all drinks</strong>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e4d3] text-[#a67b53]">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8c7661]">Delivery</p>
                  <strong className="text-sm text-[#4b3729]">Priority queue</strong>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e4d3] text-[#a67b53]">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8c7661]">Reward</p>
                  <strong className="text-sm text-[#4b3729]">Birthday bonus</strong>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e4d3] text-[#a67b53]">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8c7661]">Access</p>
                  <strong className="text-sm text-[#4b3729]">Instant activation</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#ead7c8] bg-white px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8c7661]">Membership status</span>
              <span className="font-bold text-[#4b3729]">{member.tier} tier active</span>
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}

export default ProfileCard
