// C:\laragon\www\WarungKopi\frontend\src\pages\customer\ProfilePage.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, LogOut, Sparkles, UserRound, Loader2 } from 'lucide-react'
import UserIdentity from './UserIdentity' // Pastikan path impor sesuai tempat kamu menyimpan UserIdentity

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // 1. Tarik data profil pelanggan langsung dari tabel 'users' TiDB
  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/profile') // Endpoint API profil kamu
      
      if (response.status === 401) {
        // Jika session habis atau belum login, tendang ke halaman login
        navigate('/login')
        return
      }
      
      const data = await response.json()
      setUser(data)
    } catch (error) {
      console.error("Gagal sinkronisasi data profil:", error)
    } finally {
      setLoading(false)
    }
  }

  // 2. Fungsi Tombol Logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) {
        navigate('/login')
      }
    } catch (error) {
      console.error("Gagal proses logout:", error)
    }
  }

  // Helper: Membuat inisial nama secara otomatis (Moh Ahsan Malik -> MAM)
  const getInitials = (fullName) => {
    if (!fullName) return '?'
    return fullName
      .split(' ')
      .map((n) => n)
      .slice(0, 3)
      .join('')
      .toUpperCase()
  }

  // Helper: Format tanggal created_at database menjadi bulan & tahun (e.g., Mei 2026)
  const formatMemberSince = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2 bg-[#F8F9FA] font-['Fredoka']">
        <Loader2 className="h-6 w-6 animate-spin text-[#2c1b0e]" />
        <span className="font-semibold text-[#4b3729]">Menyelaraskan profil dengan server...</span>
      </div>
    )
  }

  // Data statistik dinamis dari kolom database kamu
  const stats = [
    { label: 'Poin Toko', value: `${user?.loyalty_points || 0} Pts` },
    { label: 'Level', value: user?.membership_status || 'Gold' },
    { label: 'Total Order', value: user?.total_orders || 0 }, 
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['Fredoka'] pb-12">
      {/* --- HERO SECTION (UI bawaan kamu yang sudah dinamis) --- */}
      <section className="screen-hero bg-[#2c1b0e] text-white p-8 lg:p-12 rounded-b-[3rem] shadow-md grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col justify-center space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] text-orange-400 font-bold">Akun Saya</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
            Profil, membership, dan alamat pelanggan dalam satu tempat.
          </h1>
          <p className="text-gray-300 text-sm max-w-md leading-relaxed">
            Halaman ini merangkum identitas pelanggan, kartu membership, alamat tersimpan, dan tracking pengiriman
            supaya kamu bisa mengelola akun tanpa pindah halaman.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/" className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 transition-all">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke menu
            </Link>
            <button 
              type="button" 
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 shadow-sm transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* KARTU AKSES CEPAT (Kanan) */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/60 font-bold block">Akses cepat</span>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black text-white tracking-wider">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <strong className="block truncate text-2xl leading-tight">{user?.name}</strong>
              <p className="truncate text-sm text-white/70">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold text-amber-300">
              <Crown className="h-4 w-4" />
              {user?.membership_status || 'Gold'} Member
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold text-orange-300">
              <Sparkles className="h-4 w-4" />
              Since {formatMemberSince(user?.created_at)}
            </span>
          </div>

          {/* Grid Statistik */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 p-3 text-center border border-white/5">
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/50">{stat.label}</p>
                <strong className="mt-1 block text-base font-bold">{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white/10 p-4 border border-white/5">
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

      {/* --- KONTEN DETAIL (Bawah Hero) --- */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. Komponen UserIdentity yang sudah kita buat interaktif sebelumnya */}
          <UserIdentity />

          {/* 2. Tempat untuk Alamat Tersimpan (Placeholder jika ada) */}
          <article className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#2c1b0e] mb-1">Alamat Utama</h3>
              <p className="text-xs text-gray-400 mb-4">Lokasi pengiriman kopi takeaway/delivery</p>
              <div className="p-4 bg-[#f8f1e8] rounded-2xl text-sm font-medium text-[#4b3729]">
                {user?.address || "Belum ada alamat utama yang disimpan."}
              </div>
            </div>
            <button className="mt-4 w-full py-2.5 border border-dashed border-[#6b4a34] text-[#6b4a34] font-bold text-xs rounded-xl hover:bg-[#f8f1e8]/40 transition-all">
              Kelola Alamat
            </button>
          </article>

          {/* 3. Kartu Pelacakan Pengiriman / Pesanan Aktif */}
          <article className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-[#2c1b0e] mb-1">Pesanan Terakhir</h3>
            <p className="text-xs text-gray-400 mb-4">Pantau status seduhan kopi aktifmu</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-100 text-xs">
                <div>
                  <span className="font-bold text-green-900 block">Order #012</span>
                  <span className="text-green-700">1x Americano</span>
                </div>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded-md font-bold uppercase tracking-wider text-[9px]">
                  SIAP AMBIL
                </span>
              </div>
            </div>
          </article>

        </div>
      </main>
    </div>
  )
}

export default ProfilePage