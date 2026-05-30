import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Sidebar from '../../components/Sidebar/Sidebar'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'
import { formatRupiah } from '../../utils/formatRupiah'
import {
  AlertCircle,
  BarChart3,
  Download,
  Loader2,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from 'lucide-react'

const timeRanges = [
  { value: 'weekly', label: 'Minggu Ini' },
  { value: 'monthly', label: 'Bulan Ini' },
  { value: 'yearly', label: 'Tahun Ini' },
]

const apiUrl = (path) => {
  const baseUrl = getApiBaseUrl()
  return baseUrl ? `${baseUrl}${path.startsWith('/') ? path : `/${path}`}` : path
}

const formatCount = (value) => Number(value || 0).toLocaleString('id-ID')

const formatCompactRupiah = (value) => {
  const numeric = Number(value) || 0

  if (numeric >= 1000000000) {
    return `Rp ${(numeric / 1000000000).toFixed(1)} M`
  }

  if (numeric >= 1000000) {
    return `Rp ${(numeric / 1000000).toFixed(1)} jt`
  }

  if (numeric >= 1000) {
    return `Rp ${(numeric / 1000).toFixed(0)} rb`
  }

  return formatRupiah(numeric)
}

const SalesReports = () => {
  const navigate = useNavigate()
  const auth = readStoredValue(STORAGE_KEYS.auth, null)

  const [timeRange, setTimeRange] = useState('monthly')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!auth || auth.role !== 'admin') {
      navigate('/login', { replace: true })
    }
  }, [auth, navigate])

  useEffect(() => {
    const controller = new AbortController()

    const fetchReport = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get(apiUrl('/api/admin/reports'), {
          params: { period: timeRange },
          signal: controller.signal,
        })

        setReport(response.data || null)
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }

        console.error('Gagal memuat laporan penjualan:', fetchError)
        setError(
          fetchError.response?.data?.error ||
            fetchError.response?.data?.message ||
            fetchError.message ||
            'Gagal memuat laporan penjualan.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchReport()

    return () => controller.abort()
  }, [timeRange, reloadToken])

  const summary = report?.summary || {}
  const salesSeries = report?.salesSeries || []
  const topProducts = report?.topProducts || []

  const reportCards = useMemo(() => {
    return [
      {
        title: 'Pendapatan',
        value: formatRupiah(summary.totalRevenue),
        note: report?.periodLabel || 'Periode aktif',
        icon: <Wallet className="h-6 w-6 text-emerald-600" />,
        tone: 'bg-emerald-50',
      },
      {
        title: 'Total Transaksi',
        value: formatCount(summary.totalTransactions),
        note: 'Order sukses dan tidak dibatalkan',
        icon: <ShoppingBag className="h-6 w-6 text-blue-600" />,
        tone: 'bg-blue-50',
      },
      {
        title: 'Rata-rata Pesanan',
        value: formatRupiah(summary.averageOrder),
        note: 'Rata-rata nominal per transaksi',
        icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
        tone: 'bg-orange-50',
      },
    ]
  }, [report?.periodLabel, summary.averageOrder, summary.totalRevenue, summary.totalTransactions])

  const handleExport = () => {
    if (!report) return

    const payload = {
      exportedAt: new Date().toISOString(),
      ...report,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sales-report-${timeRange}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#F8F9FA] lg:flex-row">
      <Sidebar role="admin" />

      <main className="w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:ml-72 lg:p-8">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Sales Reports</h1>
            <p className="text-gray-500">Analisis performa penjualan dan pendapatan warung.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setReloadToken((current) => current + 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 font-bold text-[#2c1b0e] shadow-sm transition hover:bg-gray-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={!report || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-bold text-[#2c1b0e] shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={18} />
              Export Laporan
            </button>
          </div>
        </header>

        {error ? (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reportCards.map((card) => (
            <ReportCard key={card.title} {...card} loading={loading} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#2c1b0e]">Grafik Pendapatan</h3>
                <p className="text-sm text-gray-500">
                  Data agregat langsung dari TiDB untuk {report?.periodLabel || 'periode aktif'}
                </p>
              </div>

              <select
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-[#2c1b0e] outline-none ring-0 transition focus:border-[#e39b4f]"
                value={timeRange}
                onChange={(event) => setTimeRange(event.target.value)}
              >
                {timeRanges.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-[420px] rounded-[1.75rem] border border-dashed border-gray-200 bg-[#fcfbf9] p-3">
              {loading ? (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memuat grafik...
                </div>
              ) : salesSeries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e39b4f" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#e39b4f" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e6db" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      tick={{ fill: '#8b6a50', fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      tick={{ fill: '#8b6a50', fontSize: 12 }}
                      tickFormatter={formatCompactRupiah}
                    />
                    <Tooltip
                      cursor={{ stroke: '#e39b4f', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid #f1e2d1',
                        boxShadow: '0 18px 45px rgba(44, 27, 14, 0.08)',
                      }}
                      labelStyle={{ color: '#2c1b0e', fontWeight: 700 }}
                      formatter={(value, name) => [
                        formatRupiah(value),
                        name === 'value' ? 'Pendapatan' : name,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#e39b4f"
                      strokeWidth={3}
                      fill="url(#revenueFill)"
                      dot={{ r: 3, fill: '#e39b4f', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#2c1b0e' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Belum ada data penjualan pada periode ini.
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#2c1b0e]">Produk Terlaris</h3>
                <p className="text-sm text-gray-500">Diurutkan berdasarkan jumlah terjual</p>
              </div>
              <BarChart3 className="h-5 w-5 text-[#e39b4f]" />
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-10 text-center text-sm text-gray-400">Memuat produk terlaris...</div>
              ) : topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <TopProduct
                    key={`${product.id}-${index}`}
                    name={product.name}
                    sold={product.totalSold}
                    revenue={product.totalRevenue}
                  />
                ))
              ) : (
                <div className="py-10 text-center text-sm text-gray-400">
                  Belum ada data produk terlaris.
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

const ReportCard = ({ title, value, note, icon, tone, loading }) => (
  <div className={`${tone} rounded-[2rem] border border-white p-6 shadow-sm`}>
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="rounded-2xl bg-white p-3 shadow-sm">{icon}</div>
      <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#8b6a50]">
        Live TiDB
      </span>
    </div>
    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</p>
    <h2 className="mt-1 text-3xl font-black text-[#2c1b0e]">{loading ? '...' : value}</h2>
    <p className="mt-2 text-sm font-medium text-[#6f6257]">{loading ? 'Memuat data...' : note}</p>
  </div>
)

const TopProduct = ({ name, sold, revenue }) => (
  <div className="rounded-2xl border border-gray-100 bg-[#fcfbf9] p-4">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[#2c1b0e]">{name}</p>
        <p className="text-xs text-gray-500">{formatCount(sold)} terjual</p>
      </div>
      <p className="shrink-0 text-sm font-bold text-[#e39b4f]">{formatRupiah(revenue)}</p>
    </div>
  </div>
)

export default SalesReports
