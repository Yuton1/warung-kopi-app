import { useEffect, useMemo, useState } from 'react'
import { Mail, Pencil, Phone, UserRound, Loader2, Save, X } from 'lucide-react'

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
        <span className="text-sm font-semibold text-[#4b3729]">{value || '-'}</span>
      </div>
    </div>
  </div>
)

const UserIdentity = ({ profile, loading = false, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({ username: '', email: '', phone: '' })

  const membershipLabel = useMemo(() => {
    return profile?.membershipStatus || profile?.membership_status || 'Bronze Member'
  }, [profile?.membershipStatus, profile?.membership_status])

  useEffect(() => {
    setFormData({
      username: profile?.username || profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    })
  }, [profile])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!onSave) {
      return
    }

    try {
      setIsSaving(true)
      await onSave(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Gagal memperbarui profil:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center gap-2 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin text-[#6b4a34]" />
        <span className="text-sm font-medium">Memuat kartu identitas...</span>
      </div>
    )
  }

  return (
    <article className="surface-card relative">
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

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="card-action"
          >
            <Pencil className="h-[14px] w-[14px]" />
            Edit
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="pl-1 text-xs font-bold uppercase tracking-wider text-[#8c7661]">
              Full Name
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/30 px-4 py-3 text-sm font-semibold text-[#4b3729] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]"
              required
            />
          </div>

          <div>
            <label className="pl-1 text-xs font-bold uppercase tracking-wider text-[#8c7661]">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/30 px-4 py-3 text-sm font-semibold text-[#4b3729] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]"
              required
            />
          </div>

          <div>
            <label className="pl-1 text-xs font-bold uppercase tracking-wider text-[#8c7661]">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/30 px-4 py-3 text-sm font-semibold text-[#4b3729] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]"
              placeholder="Contoh: 08xxxxxxxxxx"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#6b4a34] py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#543926] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Simpan
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setFormData({
                  username: profile?.username || profile?.name || '',
                  email: profile?.email || '',
                  phone: profile?.phone || '',
                })
              }}
              className="flex items-center justify-center rounded-xl bg-gray-100 px-3 py-2.5 text-xs font-bold text-gray-500 transition-all hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <Field icon={UserRound} label="Full Name" value={profile?.username || profile?.name} />
          <Field icon={Mail} label="Email Address" value={profile?.email} />
          <Field icon={Phone} label="Phone Number" value={profile?.phone} />

          <div className="rounded-2xl bg-[#f8f1e8] px-4 py-4">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c7661]">
              Membership Status
            </label>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#c9a96e] px-3 py-1 text-xs font-bold text-[#3a2a1e]">
              {membershipLabel}
            </span>
          </div>
        </div>
      )}
    </article>
  )
}

export default UserIdentity
