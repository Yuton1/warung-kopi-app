import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import {
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import axios from 'axios'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'

const getProductsApiUrl = () => {
  const baseUrl = getApiBaseUrl()
  return baseUrl ? `${baseUrl}/api/products` : '/api/products'
}

const normalizeProduct = (product) => ({
  ...product,
  id: product.id,
  name: product.name || 'Menu',
  category: product.category || '-',
  stock: Number(product.stock) || 0,
  is_available: Number(product.is_available) ? 1 : 0,
})

const getRowClassName = (product) => {
  if (product.is_available === 0 || product.stock === 0) {
    return 'bg-red-50/30'
  }

  if (product.stock <= 5) {
    return 'bg-orange-50/20'
  }

  return 'bg-white hover:bg-gray-50/70'
}

const Inventory = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadProducts = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError('')

      const response = await axios.get(getProductsApiUrl())
      const nextProducts = Array.isArray(response.data) ? response.data.map(normalizeProduct) : []
      setProducts(nextProducts)
      setLastUpdated(new Date())
    } catch (fetchError) {
      console.error('Gagal memuat inventory:', fetchError)
      setError(fetchError.response?.data?.error || fetchError.message || 'Gagal memuat inventory.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const stats = useMemo(() => {
    const total = products.length
    const active = products.filter((product) => product.is_available === 1).length
    const inactive = products.filter((product) => product.is_available === 0).length
    const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length
    const outOfStock = products.filter((product) => product.stock === 0).length

    return { total, active, inactive, lowStock, outOfStock }
  }, [products])

  const toggleAvailability = async (productId, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 0 : 1

    try {
      setUpdatingId(productId)
      setError('')

      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, is_available: nextStatus } : product
        )
      )

      const response = await axios.patch(`${getProductsApiUrl()}/${productId}/availability`, {
        is_available: nextStatus,
      })

      const updated = normalizeProduct(response.data)
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updated } : product
        )
      )
      setLastUpdated(new Date())
    } catch (updateError) {
      console.error('Gagal memperbarui ketersediaan produk:', updateError)
      setError(updateError.response?.data?.error || updateError.message || 'Gagal memperbarui ketersediaan produk.')
      loadProducts(true)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (stock, isAvailable) => {
    if (isAvailable === 0 || stock === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
          <XCircle size={15} />
          {stock === 0 ? 'Habis' : 'Dimatikan'}
        </span>
      )
    }

    if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
          <CheckCircle2 size={15} />
          Stok Tipis
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
        <CheckCircle2 size={15} />
        Aman
      </span>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA] font-['Fredoka']">
      <Sidebar role="barista" />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Menu Inventory</h1>
            <p className="text-gray-500">Kelola stok dan nyalakan/matikan menu langsung dari TiDB.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadProducts(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#2c1b0e] shadow-sm transition hover:bg-[#f6efe7]"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div className="rounded-2xl bg-[#2c1b0e] px-5 py-3 text-white shadow-lg">
              <span className="text-sm font-bold">{stats.active} Menu Aktif</span>
            </div>
          </div>
        </header>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Menu" value={stats.total} tone="text-[#2c1b0e]" />
          <StatCard label="Menu Aktif" value={stats.active} tone="text-emerald-600" />
          <StatCard label="Stok Tipis" value={stats.lowStock} tone="text-orange-600" />
          <StatCard label="Stok Habis" value={stats.outOfStock} tone="text-red-600" />
        </div>

        {error ? (
          <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                <tr>
                  <th className="px-6 py-4">Nama Menu</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Stok</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Toggle Live</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-14 text-center text-gray-400">
                      Memuat inventory...
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className={`transition-colors ${getRowClassName(product)}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl bg-[#2c1b0e] text-white flex items-center justify-center font-bold">
                            {String(product.name || 'M').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#2c1b0e]">{product.name}</p>
                            <p className="text-xs text-gray-400">ID #{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#2c1b0e]">{product.stock}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(product.stock, product.is_available)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(product.id, product.is_available)}
                          disabled={updatingId === product.id}
                          className={`inline-flex items-center justify-center transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                            product.is_available === 1 ? 'text-emerald-600' : 'text-gray-300'
                          }`}
                          title={product.is_available === 1 ? 'Matikan menu' : 'Aktifkan menu'}
                        >
                          {updatingId === product.id ? (
                            <Loader2 size={34} className="animate-spin" />
                          ) : product.is_available === 1 ? (
                            <ToggleRight size={38} />
                          ) : (
                            <ToggleLeft size={38} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-14 text-center text-gray-400">
                      Tidak ada data inventory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {lastUpdated ? (
          <p className="mt-4 text-xs text-gray-400">Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}</p>
        ) : null}
      </main>
    </div>
  )
}

const StatCard = ({ label, value, tone }) => (
  <div className="rounded-[1.75rem] border border-gray-100 bg-white px-5 py-4 shadow-sm">
    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">{label}</p>
    <p className={`mt-2 text-3xl font-black ${tone}`}>{value}</p>
  </div>
)

export default Inventory
