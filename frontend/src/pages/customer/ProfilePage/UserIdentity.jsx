import { Mail, Pencil, Phone, UserRound } from 'lucide-react'

const Field = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between rounded-2xl bg-[#f8f1e8] px-4 py-4 transition-colors hover:bg-[#f3e7d9]">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#6b4a34] shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c7661]">
          {label}
        </label>
        <span className="text-sm font-semibold text-[#4b3729]">{value}</span>
      </div>
    </div>
  </div>
)

const UserIdentity = ({ name, email, phone, status = 'Gold Member' }) => {
  return (
    <article className="surface-card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon brown">
            <UserRound className="h-[22px] w-[22px]" />
          </div>
          <div>
            <h3>User Identity</h3>
            <p>Your personal information</p>
          </div>
        </div>
        <button type="button" className="card-action">
          <Pencil className="h-[14px] w-[14px]" />
          Edit
        </button>
      </div>

      <div className="space-y-4">
        <Field icon={UserRound} label="Full Name" value={name || '-'} />
        <Field icon={Mail} label="Email Address" value={email || '-'} />
        <Field icon={Phone} label="Phone Number" value={phone || '-'} />

        <div className="rounded-2xl bg-[#f8f1e8] px-4 py-4">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c7661]">
            Membership Status
          </label>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#c9a96e] px-3 py-1 text-xs font-bold text-[#3a2a1e]">
            {status}
          </span>
        </div>
      </div>
    </article>
  )
}

export default UserIdentity
