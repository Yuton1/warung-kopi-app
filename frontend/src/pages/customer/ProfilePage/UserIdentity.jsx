import React, { useState, useEffect } from 'react'
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
        <span className="text-sm font-semibold text-[#4b3729]">{value}</span>
      </div>
    </div>
  </div>
)

// Menghapus parameter props statik karena kita akan fetch langsung dari user session / API
const UserIdentity = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  
  // State form untuk menampung inputan baru saat mengedit data profil
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })

  // 1. Ambil data user aktif dari tabel 'users' saat komponen dimuat
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      // Gunakan endpoint profile atau sesuaikan berdasarkan mekanisme auth/session kamu
      const response = await fetch('/api/user/profile') 
      const data = await response.json()
      
      setUser(data)
      setFormData({ name: data.name, email: data.email, phone: data.phone || '' })
    } catch (error) {
      console.error("Gagal memuat identitas pengguna:", error)
    } finally {
      setLoading(false)
    }
  }

  // 2. Kirim update perubahan data ke database TiDB
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      // Query di Backend: UPDATE users SET name = ?, email = ?, phone = ? WHERE Id = ?
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Gagal memperbarui profil:", error)
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
        {!isEditing && (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)} 
            className="card-action"
          >
            <Pencil className="h-[14px] w-[14px]" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        /* Form interaktif untuk edit data profil */
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#8c7661] uppercase tracking-wider pl-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/30 px-4 py-3 text-sm font-semibold text-[#4b3729] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#8c7661] uppercase tracking-wider pl-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/30 px-4 py-3 text-sm font-semibold text-[#4b3729] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#8c7661] uppercase tracking-wider pl-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/30 px-4 py-3 text-sm font-semibold text-[#4b3729] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#6b4a34] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#543926] transition-all"
            >
              <Save className="h-3.5 w-3.5" /> Simpan
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setFormData({ name: user.name, email: user.email, phone: user.phone || '' })
              }}
              className="flex items-center justify-center rounded-xl bg-gray-100 px-3 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-200 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : (
        /* Tampilan Utama Mode Read-Only */
        <div className="space-y-4">
          <Field icon={UserRound} label="Full Name" value={user?.name || '-'} />
          <Field icon={Mail} label="Email Address" value={user?.email || '-'} />
          <Field icon={Phone} label="Phone Number" value={user?.phone || '-'} />

          <div className="rounded-2xl bg-[#f8f1e8] px-4 py-4">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c7661]">
              Membership Status
            </label>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#c9a96e] px-3 py-1 text-xs font-bold text-[#3a2a1e]">
              {user?.membership_status || 'Gold Member'}
            </span>
          </div>
        </div>
      )}
    </article>
  )
}

export default UserIdentity