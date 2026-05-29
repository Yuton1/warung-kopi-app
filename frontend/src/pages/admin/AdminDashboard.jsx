import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BarChart3, Coffee, DollarSign, Package2, TrendingUp, Users } from 'lucide-react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'
import { formatRupiah } from '../../utils/formatRupiah'

const periodOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly']

const AdminDashboard = () => {
  const navigate = useNavigate()
  const auth = readStoredValue(STORAGE_KEYS.auth)
  const [reportPeriod, setReportPeriod] = useState('Daily')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_BASE_URL = getApiBaseUrl()
  const dashboardUrl = API_BASE_URL ? `${API_BASE_URL}/api/admin/dashboard` : '/api/admin/dashboard'

  useEffect(() => {
    if (!auth || auth.role !== 'admin') {
      navigate('/login', { replace: true })
    }
  }, [auth, navigate])

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get(dashboardUrl, {
          params: { period: reportPeriod },
        })
        setSummary(response.data)
      } catch (fetchError) {
        console.error('Gagal memuat dashboard admin:', fetchError)
        setError(fetchError.response?.data?.error || 'Gagal memuat dashboard admin.')
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [dashboardUrl, reportPeriod])

  const stats = useMemo(() => {
    const data = summary?.stats || {}

    return [
      {
        title: 'Total Earnings',
        value: formatRupiah(data.totalEarnings),
        icon: <DollarSign color="#e39b4f" />,
        trend: `${data.totalOrders || 0} orders in ${reportPeriod.toLowerCase()}`,
      },
      {
        title: 'New Customers',
        value: data.newCustomers ?? 0,
        icon: <Users color="#e39b4f" />,
        trend: `${data.activeMembers || 0} active members`,
      },
      {
        title: 'Orders Processed',
        value: data.ordersProcessed ?? 0,
        icon: <Coffee color="#e39b4f" />,
        trend: `${data.totalOrders || 0} total orders`,
      },
      {
        title: 'Loyalty Points',
        value: data.loyaltyPoints?.toLocaleString('id-ID') ?? '0',
        icon: <TrendingUp color="#e39b4f" />,
        trend: 'From customer accounts',
      },
    ]
  }, [reportPeriod, summary])

  const chartMax = Math.max(...(summary?.salesSeries?.map((item) => item.value) || [0]), 1)

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#F8F9FA] lg:flex-row">
      <Sidebar role="admin" />

      <main className="w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:ml-72 lg:p-8">
        <header className="mb-10 flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Admin Dashboard</h1>
            <p className="text-gray-500">Selamat datang kembali, {auth?.name || 'Admin'}</p>
          </div>

          <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            {periodOptions.map((period) => (
              <button
                key={period}
                onClick={() => setReportPeriod(period)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  reportPeriod === period
                    ? 'bg-[#e39b4f] text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} loading={loading} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#2c1b0e]">Sales Analytics ({reportPeriod})</h3>
                <p className="text-sm text-gray-500">Data penjualan langsung dari TiDB</p>
              </div>
              <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-[#8b5e34]">
                {summary?.salesSeries?.length || 0} data points
              </div>
            </div>

            <div className="flex h-80 items-end gap-3 rounded-2xl border border-dashed border-gray-200 bg-[#fbfbfb] p-5">
              {loading ? (
                <div className="flex w-full items-center justify-center text-gray-400">
                  Memuat grafik...
                </div>
              ) : summary?.salesSeries?.length ? (
                summary.salesSeries.map((point) => {
                  const height = Math.max((point.value / chartMax) * 100, 10)

                  return (
                    <div key={`${point.label}-${point.value}`} className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex h-full w-full items-end">
                        <div className="w-full rounded-t-2xl bg-gradient-to-t from-[#e39b4f] to-[#ffcf91]" style={{ height: `${height}%` }} />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#2c1b0e]">{point.label}</p>
                        <p className="text-[11px] text-gray-500">{formatRupiah(point.value)}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex w-full items-center justify-center text-gray-400">
                  Belum ada data penjualan.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#2c1b0e]">Recent Orders</h3>
                <p className="text-sm text-gray-500">Pesanan terbaru dari TiDB</p>
              </div>
              <Package2 className="h-5 w-5 text-[#e39b4f]" />
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-8 text-center text-sm text-gray-400">Memuat recent orders...</div>
              ) : summary?.recentOrders?.length ? (
                summary.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 font-bold text-[#e39b4f]">
                      #{String(order.id).slice(-2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-800">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#2c1b0e]">{formatRupiah(order.totalAmount)}</p>
                      <p className="text-xs text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString('id-ID') : '-'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-gray-400">Belum ada pesanan terbaru.</div>
              )}
            </div>

            <div className="mt-8 rounded-2xl bg-[#faf5ef] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#2c1b0e]">
                <BarChart3 className="h-4 w-4 text-[#e39b4f]" />
                Top Products
              </div>
              <div className="space-y-3">
                {summary?.topProducts?.length ? summary.topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <span className="truncate pr-3 text-gray-700">{product.name}</span>
                    <strong className="text-[#2c1b0e]">{product.totalSold}</strong>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500">Belum ada data produk terlaris.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

const StatCard = ({ title, value, icon, trend, loading }) => (
  <div className="rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-start justify-between">
      <div className="rounded-2xl bg-orange-50 p-3">{icon}</div>
    </div>
    <p className="text-sm font-medium uppercase tracking-wider text-gray-400">{title}</p>
    <h4 className="mt-1 text-2xl font-black text-[#2c1b0e]">
      {loading ? '...' : value}
    </h4>
    <p className="mt-2 text-xs font-semibold text-green-500">{loading ? 'Memuat data...' : trend}</p>
  </div>
)

export default AdminDashboard
