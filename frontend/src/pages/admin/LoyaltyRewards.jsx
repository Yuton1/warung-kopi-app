import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar/Sidebar'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'
import { formatRupiah } from '../../utils/formatRupiah'
import {
  ArrowRight,
  BarChart3,
  Edit3,
  Gift,
  Loader2,
  Search,
  Star,
  Trophy,
  Users,
  Wallet,
  Plus,
  X
} from 'lucide-react'

const POINT_VALUE = 1000

// ==========================================
// UTILITY / HELPER FUNCTIONS (DITAROH DI ATAS)
// ==========================================
const totalNumber = (value) => Number(value || 0).toLocaleString('id-ID')

const apiUrl = (path) => {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) return path
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeText = (value) => String(value ?? '').trim()

const normalizeUser = (user) => ({
  id: user?.id ?? null,
  username: normalizeText(user?.username || user?.name) || 'Member',
  email: normalizeText(user?.email) || '-',
  points: parseNumber(user?.points ?? user?.loyalty_points, 0),
  tier: normalizeText(user?.membership_status || user?.membershipStatus) || 'Bronze',
  role: normalizeText(user?.role) || 'customer',
})

const normalizeProduct = (product) => ({
  id: product?.id ?? null,
  name: normalizeText(product?.name) || 'Menu',
  category: normalizeText(product?.category) || '-',
  basePoints: parseNumber(product?.base_points, 0),
  price: parseNumber(product?.price, 0),
  stock: parseNumber(product?.stock, 0),
  isAvailable: Number(product?.is_available) ? 1 : 0,
  badge: normalizeText(product?.badge),
})

// ==========================================
// MAIN COMPONENT
// ==========================================
const LoyaltyRewards = () => {
  const navigate = useNavigate()
  const auth = readStoredValue(STORAGE_KEYS.auth, null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // State untuk Modal Tambah Hadiah / Promo Baru
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountAmount: '',
    quota: '',
    expiryDate: '',
  })

  useEffect(() => {
    if (!auth || auth.role !== 'admin') {
      navigate('/login', { replace: true })
    }
  }, [auth, navigate])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [usersResponse, productsResponse] = await Promise.all([
        axios.get(apiUrl('/api/users')),
        axios.get(apiUrl('/api/products')),
      ])
      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data.map(normalizeUser) : [])
      setProducts(Array.isArray(productsResponse.data) ? productsResponse.data.map(normalizeProduct) : [])
    } catch (fetchError) {
      console.error('Gagal memuat loyalty rewards:', fetchError)
      setError(fetchError.response?.data?.message || fetchError.response?.data?.error || fetchError.message || 'Gagal memuat data loyalty.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const stats = useMemo(() => {
    const totalPoints = users.reduce((sum, user) => sum + parseNumber(user.points, 0), 0)
    const activeMembers = users.filter((user) => parseNumber(user.points, 0) > 0).length
    const averagePoints = activeMembers > 0 ? Math.round(totalPoints / activeMembers) : 0
    const productsWithPoints = products.filter((product) => parseNumber(product.basePoints, 0) > 0).length

    return {
      totalPoints,
      activeMembers,
      averagePoints,
      productsWithPoints,
    }
  }, [products, users])

  const filteredProducts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()
    const sortedProducts = [...products].sort((a, b) => b.basePoints - a.basePoints)

    if (!query) return sortedProducts

    return sortedProducts.filter((product) =>
      [product.name, product.category, product.badge]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [products, searchTerm])

  const topMembers = useMemo(() => {
    return [...users]
      .sort((a, b) => b.points - a.points)
      .slice(0, 5)
  }, [users])

  // Handler Kirim Data Hadiah / Promo Baru ke TiDB lewat Backend
  const handleCreateReward = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    const targetQuota = parseNumber(formData.quota)

    try {
      await axios.post(apiUrl('/api/admin/promos'), {
        title: formData.title,
        description: formData.description,
        discount_amount: parseNumber(formData.discountAmount),
        quota: targetQuota,
        remaining_quota: targetQuota, 
        expiry_date: formData.expiryDate,
        is_active: 1
      })
      
      alert('Kupon hadiah berhasil disimpan!')
      
      setFormData({ title: '', description: '', discountAmount: '', quota: '', expiryDate: '' })
      setIsModalOpen(false)
      await loadData()
    } catch (err) {
      console.error('Gagal menyimpan kupon hadiah:', err)
      alert(err.response?.data?.error || err.response?.data?.message || 'Gagal menyimpan item hadiah baru.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] overflow-hidden lg:flex-row">
      <Sidebar role="admin" />

      <main className="w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:ml-72 lg:p-8">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Loyalty Rewards</h1>
            <p className="text-gray-500">
              Manajemen poin reward pelanggan dan konfigurasi nilai penukaran poin TiDB.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-bold text-[#2c1b0e] shadow-sm transition hover:bg-gray-50"
            >
              <Loader2 className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
              Refresh Data
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#e39b4f] px-5 py-3 font-bold text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#c9863e]"
            >
              <Plus className="h-4 w-4" />
              Tambah Item Hadiah
            </button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Poin Member"
            value={loading ? '...' : totalNumber(stats.totalPoints)}
            note="Akumulasi poin seluruh user aktif"
            icon={<Wallet className="text-[#ff7b00]" />}
            color="bg-orange-50"
          />
          <StatCard
            title="Member Aktif"
            value={loading ? '...' : totalNumber(stats.activeMembers)}
            note="User dengan saldo poin > 0"
            icon={<Users className="text-purple-500" />}
            color="bg-purple-50"
          />
          <StatCard
            title="Rata-rata Poin"
            value={loading ? '...' : totalNumber(stats.averagePoints)}
            note="Rata-rata saldo per member aktif"
            icon={<Trophy className="text-emerald-500" />}
            color="bg-emerald-50"
          />
          <StatCard
            title="Menu Berpoin"
            value={loading ? '...' : totalNumber(stats.productsWithPoints)}
            note={`Base rate ${formatRupiah(POINT_VALUE)} / poin`}
            icon={<Star className="text-yellow-500" />}
            color="bg-yellow-50"
          />
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {/* Search Bar */}
        <div className="mb-6 rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari menu atau kategori..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-2xl font-black text-[#2c1b0e]">Katalog Produk Berpoin</h2>
              <p className="text-sm text-gray-500">
                Kelola nilai loyalty langsung dari field `base_points` di tabel `products`.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-6 py-4">Menu</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Base Points</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4">Stok</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-14 text-center text-gray-400">
                        Memuat data loyalty...
                      </td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="transition hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-[#2c1b0e]">{product.name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#e39b4f]">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-orange-600">
                          {product.basePoints} Poin
                        </td>
                        <td className="px-6 py-4 font-medium">{formatRupiah(product.price)}</td>
                        <td className="px-6 py-4 text-gray-600">{product.stock} unit</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/menu/edit/${product.id}`)}
                              className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-50"
                              title="Edit base points di menu"
                            >
                              <Edit3 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-14 text-center text-gray-400">
                        Tidak ada menu yang cocok dengan pencarian ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sidebar Leaderboard */}
          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <div className="rounded-2xl bg-orange-50 p-3 text-[#ff7b00]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#2c1b0e]">Top Member</h3>
                  <p className="text-sm text-gray-500">Urutan user dengan saldo poin tertinggi</p>
                </div>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <p className="py-6 text-center text-sm text-gray-400">Memuat leaderboard...</p>
                ) : topMembers.length > 0 ? (
                  topMembers.map((member, index) => (
                    <div
                      key={`${member.id || member.email}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#2c1b0e]">{member.username}</p>
                        <p className="text-xs text-gray-500">{member.tier} Member</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-[#e39b4f]">{totalNumber(member.points)}</p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">Poin</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-gray-400">Belum ada member dengan poin aktif.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* MODAL DIALOG COMPONENT: TAMBAH ITEM HADIAH / PROMO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#2c1b0e]">Tambah Kupon Hadiah</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReward} className="space-y-4">
              {/* Form Input fields ... */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nama Hadiah / Promo</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Voucher Kopi Gratis Akhir Pekan"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Deskripsi & Syarat</label>
                <textarea
                  placeholder="Tukarkan dengan 50 poin untuk potongan harga latte..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e39b4f] h-20 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nilai Diskon (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="15000"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Kuota Klaim</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Tanggal Kedaluwarsa</label>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e39b4f] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#c9863e] transition disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Simpan Kupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ title, value, note, icon, color }) => (
  <div className={`${color} rounded-[1.5rem] border border-white p-6 shadow-sm transition-shadow hover:shadow-md`}>
    <div className="mb-4 flex items-start justify-between">
      <div className="rounded-2xl bg-white p-3 shadow-sm">{icon}</div>
    </div>
    <p className="text-sm font-medium uppercase tracking-wider text-gray-500">{title}</p>
    <h4 className="mt-1 text-2xl font-black text-[#2c1b0e]">{value}</h4>
    <p className="mt-2 text-xs font-semibold text-[#6f6257]">{note}</p>
  </div>
)

export default LoyaltyRewards