import { useEffect, useMemo, useState } from 'react'
import { Mail, Pencil, Phone, UserRound, Loader2, Save, X, Award } from 'lucide-react'

const Field = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between rounded-2xl bg-[#f8f1e8]/60 px-5 py-4 transition-all duration-300 hover:bg-[#f3e7d9] hover:scale-[1.01] hover:shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#6b4a34] shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c7661]">
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

  // Kalkulasi Level Membership berdasarkan Poin secara Akurat
  const membershipLabel = useMemo(() => {
    // Ambil status spesifik dari penamaan database backend
    const explicitStatus = profile?.membershipStatus || profile?.membership_status || profile?.tier
    
    if (explicitStatus && explicitStatus !== '') {
      return explicitStatus
    }

    // Jika tidak ada status eksplisit, tentukan tier murni berdasarkan akumulasi poin di tabel users
    const points = Number(profile?.points || 0)
    if (points >= 3000) return 'Platinum Member'
    if (points >= 1500) return 'Gold Member'
    if (points >= 500) return 'Silver Member'
    return 'Bronze Member'
  }, [profile?.membershipStatus, profile?.membership_status, profile?.tier, profile?.points])

  useEffect(() => {
    setFormData({
      username: profile?.username || profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    })
  }, [profile])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!onSave) return

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
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-[#6b4a34]" />
        <span className="text-sm font-medium animate-pulse">Sinkronisasi data TiDB...</span>
      </div>
    )
  }

  return (
    <article className="w-full bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-500 overflow-hidden">
      
      {/* Header Kartu */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6b4a34] text-white shadow-md shadow-[#6b4a34]/10">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#2c1b0e]">User Identity</h3>
            <p className="text-xs text-gray-400">Your personal information securely synced</p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#6b4a34]/20 px-4 py-2 text-xs font-bold text-[#6b4a34] bg-transparent transition-all duration-300 hover:bg-[#6b4a34] hover:text-white hover:border-[#6b4a34] active:scale-95"
          >
            <Pencil className="h-3 w-3" />
            Edit Profil
          </button>
        )}
      </div>

      {/* Konten Utama Form / Detail View */}
      <div className={`transition-all duration-500 ease-in-out ${isEditing ? 'opacity-100 transform translate-y-0' : 'opacity-100'}`}>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-[fadeIn_0.3s_ease-in-out]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="pl-1 text-[11px] font-bold uppercase tracking-wider text-[#8c7661]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/20 px-4 py-3 text-sm font-semibold text-[#4b3729] transition-all duration-300 focus:border-[#6b4a34] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]/10"
                  required
                />
              </div>

              <div>
                <label className="pl-1 text-[11px] font-bold uppercase tracking-wider text-[#8c7661]">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/20 px-4 py-3 text-sm font-semibold text-[#4b3729] transition-all duration-300 focus:border-[#6b4a34] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]/10"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="pl-1 text-[11px] font-bold uppercase tracking-wider text-[#8c7661]">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/20 px-4 py-3 text-sm font-semibold text-[#4b3729] transition-all duration-300 focus:border-[#6b4a34] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]/10"
                required
              />
            </div>

            {/* Aksi Tombol Form */}
            <div className="flex justify-end gap-3 pt-3 mt-4 border-t border-gray-50/80">
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
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-500 transition-all duration-300 hover:bg-gray-200 active:scale-95"
              >
                <X className="h-3.5 w-3.5" />
                Batal
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#6b4a34] px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#6b4a34]/10 transition-all duration-300 hover:bg-[#543926] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Simpan Perubahan
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3.5 animate-[fadeIn_0.3s_ease-in-out]">
            {/* Grid Informasi Identitas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field icon={UserRound} label="Full Name" value={profile?.username || profile?.name} />
              <Field icon={Phone} label="Phone Number" value={profile?.phone} />
            </div>
            
            <Field icon={Mail} label="Email Address" value={profile?.email} />

            {/* Status Membership Card */}
            <div className="mt-2 rounded-2xl bg-[#6b4a34] p-5 text-white shadow-inner relative overflow-hidden group">
              {/* Ornamen Dekoratif Latar Belakang */}
              <div className="absolute -right-6 -bottom-6 text-white/5 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">
                <Award className="h-32 w-32" />
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#dfc3af]">
                    Current Membership Level
                  </label>
                  <span className="text-lg font-black tracking-wide text-white drop-shadow-sm">
                    {membershipLabel}
                  </span>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                  <p className="text-[10px] font-medium text-[#dfc3af] uppercase tracking-wider">Accumulated Balance</p>
                  <p className="text-xl font-black text-[#f3e7d9]">
                    {Number(profile?.points || 0).toLocaleString('id-ID')} <span className="text-xs font-bold text-[#dfc3af]">PTS</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export default UserIdentity