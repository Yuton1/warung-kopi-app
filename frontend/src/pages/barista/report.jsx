import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'
import { formatRupiah } from '../../utils/formatRupiah'
import axios from 'axios'
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Award,
  Download,
  Calendar,
  Coffee,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const getReportApiUrl = () => {
  const baseUrl = getApiBaseUrl()
  return baseUrl ? `${baseUrl}/api/barista/reports/daily` : '/api/barista/reports/daily'
}

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const formatCount = (value) => Number(value || 0).toLocaleString('id-ID')

const BaristaDailyReport = () => {
  const auth = readStoredValue(STORAGE_KEYS.auth, null)

  const [reportData, setReportData] = useState({
    totalEarnings: 0,
    totalTransactions: 0,
    averageOrderValue: 0,
    topProducts: [],
    hourlySales: [],
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    if (!auth || (auth.role !== 'barista' && auth.role !== 'admin')) {
      window.location.href = '/login'
    }
  }, [auth])

  const loadReportData = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError('')

      const response = await axios.get(getReportApiUrl())

      setReportData({
        totalEarnings: parseNumber(response.data?.totalEarnings),
        totalTransactions: parseNumber(response.data?.totalTransactions),
        averageOrderValue: parseNumber(response.data?.averageOrderValue),
        topProducts: Array.isArray(response.data?.topProducts) ? response.data.topProducts : [],
        hourlySales: Array.isArray(response.data?.hourlySales) ? response.data.hourlySales : [],
      })
      setLastUpdated(new Date())
    } catch (fetchError) {
      console.error('Gagal memuat daily report barista:', fetchError)
      setError(fetchError.response?.data?.error || fetchError.message || 'Gagal memuat laporan harian.')
      setReportData({
        totalEarnings: 0,
        totalTransactions: 0,
        averageOrderValue: 0,
        topProducts: [],
        hourlySales: [],
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#F8F9FA] font-['Fredoka'] lg:flex-row">
      <Sidebar role="barista" />

      <main className="w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:ml-72 lg:p-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-[#2c1b0e] p-2 text-white">
                <TrendingUp size={20} />
              </div>
              <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Daily Report</h1>
            </div>
            <p className="mt-2 text-gray-500">
              Analisis performa penjualan, pesanan, dan menu terlaris shifts hari ini.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadReportData(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#2c1b0e] shadow-sm transition hover:bg-[#f6efe7]"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2c1b0e] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/10 transition hover:bg-[#472f1b]"
            >
              <Download size={16} />
              Export Laporan
            </button>
          </div>
        </header>

        {error ? (
          <div className="mb-6 flex items-start gap-3 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Pendapatan Hari Ini"
            value={formatRupiah(reportData.totalEarnings)}
            icon={<DollarSign size={20} className="text-emerald-600" />}
            note="Live dari kasir meja & takeaway"
          />
          <StatCard
            label="Total Transaksi"
            value={`${formatCount(reportData.totalTransactions)} Pesanan`}
            icon={<ShoppingBag size={20} className="text-blue-600" />}
            note="Semua status pesanan selesai"
          />
          <StatCard
            label="Rata-rata Struk"
            value={formatRupiah(reportData.averageOrderValue)}
            icon={<Award size={20} className="text-orange-600" />}
            note="Nilai pengeluaran per pelanggan"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#2c1b0e]">Grafik Pendapatan Terkini</h2>
                <p className="text-xs text-gray-400">Tren grafik berdasarkan interval waktu operasional hari ini.</p>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-500">
                <Calendar size={14} />
                Hari Ini
              </div>
            </div>

            <div className="h-72 w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : reportData.hourlySales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.hourlySales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="reportSalesColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e39b4f" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#e39b4f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `Rp ${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [formatRupiah(value), 'Pendapatan']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        borderColor: '#f3f4f6',
                        fontFamily: 'Fredoka',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#e39b4f"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#reportSalesColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Belum ada data penjualan hari ini.
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 border-b border-gray-50 pb-4">
              <h2 className="text-xl font-bold text-[#2c1b0e]">Menu Terlaris</h2>
              <p className="text-xs text-gray-400">Menu paling banyak diproduksi hari ini.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="py-6 text-center text-sm text-gray-400">
                  <Loader2 className="mx-auto mb-2 animate-spin" size={18} />
                  Memuat rangking menu...
                </div>
              ) : reportData.topProducts.length > 0 ? (
                reportData.topProducts.map((product, index) => (
                  <div key={`${product.id}-${index}`} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 font-bold text-sm text-[#e39b4f]">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#2c1b0e]">{product.name}</p>
                        <p className="text-xs text-gray-400">{formatCount(product.sold)} Porsi Terbuat</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-700">{formatRupiah(product.revenue)}</p>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-gray-400">Belum ada data seduhan keluar.</p>
              )}
            </div>
          </aside>
        </div>

        {lastUpdated ? (
          <p className="mt-4 text-xs text-gray-400">
            Terakhir disinkronkan: {lastUpdated.toLocaleTimeString('id-ID')}
          </p>
        ) : null}
      </main>
    </div>
  )
}

const StatCard = ({ label, value, icon, note }) => (
  <div className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm">
    <div className="mb-2 flex items-center justify-between">
      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">{label}</p>
      <div className="rounded-xl bg-gray-50 p-2 shadow-sm">{icon}</div>
    </div>
    <p className="text-2xl font-black text-[#2c1b0e]">{value}</p>
    <p className="mt-2 text-[11px] font-medium text-gray-400">{note}</p>
  </div>
)

export default BaristaDailyReport
