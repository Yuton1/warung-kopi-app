import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { fetchBaristaQueue, updateBaristaOrderStatus } from '../../services/baristaOrderService'
import { formatRupiah } from '../../utils/formatRupiah'
import { CheckCircle, Clock, Coffee, Package, RefreshCw, User, Loader2, CheckSquare, Search, Calendar } from 'lucide-react'

const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
}

const toStatusCode = (order) => {
  const normalized = String(order?.statusRaw ?? order?.status ?? '').toLowerCase()

  if (normalized === 'pending' || normalized === 'new' || normalized === 'menunggu' || normalized === 'pemesanan') {
    return ORDER_STATUS.PENDING
  }

  if (
    normalized === 'processing' ||
    normalized === 'proses' ||
    normalized === 'diproses' ||
    normalized === 'in progress'
  ) {
    return ORDER_STATUS.PROCESSING
  }

  if (normalized === 'ready' || normalized === 'siap' || normalized === 'siap diambil' || normalized === 'siap_diambil') {
    return ORDER_STATUS.READY
  }

  return null
}

// Cek apakah pesanan masuk riwayat (Selesai/Dibatalkan)
const isHistoryStatus = (order) => {
  const normalized = String(order?.statusRaw ?? order?.status ?? '').toLowerCase()
  return ['selesai', 'done', 'completed', 'dibatalkan', 'cancelled'].includes(normalized)
}

const statusMeta = {
  [ORDER_STATUS.PENDING]: {
    label: 'Antrean Baru',
    chip: 'bg-amber-100 text-amber-800 border border-amber-200',
    panel: 'border-amber-200/60 bg-white',
    button: 'bg-[#ff7b00] hover:bg-[#e06c00] text-white shadow-[0_4px_12px_rgba(255,123,0,0.2)]',
    title: 'Antrean Baru (FIFO)',
    actionLabel: 'Seduh Kopi',
    icon: Clock,
  },
  [ORDER_STATUS.PROCESSING]: {
    label: 'Sedang Diseduh',
    chip: 'bg-orange-100 text-[#ff7b00] border border-orange-200',
    panel: 'border-orange-200/60 bg-[#fffdfa]',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)]',
    title: 'Sedang Diseduh',
    actionLabel: 'Siap Diambil',
    icon: Coffee,
  },
  [ORDER_STATUS.READY]: {
    label: 'Siap Diambil',
    chip: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    panel: 'border-emerald-200/60 bg-emerald-50/20',
    button: 'bg-[#2c1b0e] hover:bg-[#432d1c] text-white shadow-[0_4px_12px_rgba(44,27,14,0.2)]',
    title: 'Siap Diambil',
    actionLabel: 'Konfirmasi Diambil',
    icon: Package,
  },
}

const OrderCard = ({ order, onMoveStatus, updatingOrderId }) => {
  const statusCode = toStatusCode(order)
  if (!statusCode) return null

  const meta = statusMeta[statusCode] || statusMeta[ORDER_STATUS.PENDING]
  const isUpdating = updatingOrderId === order.id
  const primaryItem = order.items?.[0]

  // Tentukan status selanjutnya saat tombol ditekan
  const getNextStatus = () => {
    if (statusCode === ORDER_STATUS.PENDING) return ORDER_STATUS.PROCESSING
    if (statusCode === ORDER_STATUS.PROCESSING) return ORDER_STATUS.READY
    if (statusCode === ORDER_STATUS.READY) return 'selesai' // Dikirim ke DB & pindah ke riwayat bawah
    return null
  }

  return (
    <div className={`rounded-[2.5rem] border p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] ${meta.panel}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className={`inline-flex items-center rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest ${meta.chip}`}>
            {meta.label}
          </div>
          <h3 className="mt-2 text-xl font-black tracking-tight text-[#2c1b0e]">
            Order #{order.id}
          </h3>
          <p className="text-xs font-bold text-gray-500 mt-0.5">
            {order.customerName}
            {order.tableNumber
              ? ` • Meja ${order.tableNumber}`
              : order.groupCode
                ? ` • Sesi ${order.groupCode}`
                : order.orderType
                  ? ` • ${order.orderType}`
                  : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Jam Masuk</p>
          <p className="font-extrabold text-sm text-[#2c1b0e]">{order.infoTime || '-'}</p>
          <p className="text-[10px] text-gray-400 font-medium">{order.infoDate || ''}</p>
        </div>
      </div>

      <div className="mb-4 rounded-[1.5rem] bg-white border border-black/[0.03] p-4 shadow-inner">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2c1b0e] text-white">
            <User size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Item Utama</p>
            <p className="truncate text-base font-black text-[#2c1b0e]">
              {primaryItem?.name || `${order.items?.length || 0} item`}
            </p>
          </div>
        </div>

        {order.pickupNote ? (
          <p className="mb-3 rounded-xl bg-[#fffaf0] border border-orange-100/70 px-3 py-2 text-xs italic font-medium text-[#ff7b00]">
            💡 "{order.pickupNote}"
          </p>
        ) : null}

        {order.items?.length > 0 ? (
          <ul className="space-y-2 text-xs font-medium text-[#4A3728]">
            {order.items.map((item) => (
              <li key={`${order.id}-${item.id}`} className="flex items-center justify-between gap-4 rounded-xl bg-[#faf6f0]/60 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#2c1b0e]">
                    {item.name} <span className="text-[#ff7b00] font-black">x{item.quantity}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {item.size || 'Regular'} {item.notes ? ` • Catatan: ${item.notes}` : ''}
                  </p>
                </div>
                <span className="text-xs font-black text-gray-500">
                  {formatRupiah(item.subtotal || item.priceAtTime * item.quantity || 0)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Total Harga</p>
          <p className="text-base font-black text-[#ff7b00]">
            {formatRupiah(order.totalAmount || 0)}
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => onMoveStatus(order.id, getNextStatus())}
          disabled={isUpdating}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all active:scale-95 disabled:opacity-70 ${meta.button}`}
        >
          {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
          {meta.actionLabel}
        </button>
      </div>
    </div>
  )
}

const OrderQueue = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [searchHistory, setSearchHistory] = useState('')

  const loadQueue = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError('')
      const queue = await fetchBaristaQueue()
      setOrders(queue)
      setLastUpdated(new Date())
    } catch (queueError) {
      console.error('Gagal memuat antrean barista:', queueError)
      setError(queueError.response?.data?.error || queueError.message || 'Gagal memuat antrean barista.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadQueue()
    const interval = setInterval(() => {
      loadQueue(true)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Saring pesanan yang masuk ke Kolom Antrean Aktif (Atas)
  const groupedActiveOrders = useMemo(() => {
    const buckets = {
      [ORDER_STATUS.PENDING]: [],
      [ORDER_STATUS.PROCESSING]: [],
      [ORDER_STATUS.READY]: [],
    }

    orders.forEach((order) => {
      if (!isHistoryStatus(order)) {
        const statusCode = toStatusCode(order)
        if (buckets[statusCode]) {
          buckets[statusCode].push(order)
        }
      }
    })

    return buckets
  }, [orders])

  // Saring pesanan yang masuk ke Tabel Riwayat Selesai (Bawah) + Fitur Pencarian
  const historyOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!isHistoryStatus(order)) return false
      if (!searchHistory.trim()) return true
      
      const search = searchHistory.toLowerCase()
      return (
        String(order.id).includes(search) ||
        order.customerName?.toLowerCase().includes(search)
      );
    })
  }, [orders, searchHistory])

  const moveStatus = async (id, nextStatus) => {
    if (!nextStatus) return
    try {
      setUpdatingOrderId(id)
      const queue = await updateBaristaOrderStatus(id, nextStatus)
      setOrders(queue)
      setLastUpdated(new Date())
    } catch (updateError) {
      console.error('Gagal memperbarui status pesanan:', updateError)
      setError(updateError.response?.data?.error || updateError.message || 'Gagal memperbarui status pesanan.')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#faf8f5] text-[#2c1b0e]">
      <Sidebar role="barista" />

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        
        {/* HEADER UTAMA */}
        <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between border-b border-black/[0.04] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff7b00]">
              <span className="h-2 w-2 rounded-full bg-[#ff7b00] animate-ping" /> Live Barista Station
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#2c1b0e] mt-1">Order Queue</h1>
            <p className="text-sm font-medium text-gray-400 mt-0.5">Kelola pembuatan minuman warkop secara real-time terintegrasi dengan TiDB.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadQueue(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white border border-black/[0.05] px-5 py-3 text-sm font-bold text-[#2c1b0e] shadow-sm transition hover:bg-[#fcfaf7]"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div className="rounded-2xl bg-[#2c1b0e] px-5 py-3 text-white shadow-md">
              <span className="text-sm font-black">
                {groupedActiveOrders[ORDER_STATUS.PENDING].length} Antrean Baru
              </span>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
            ⚠️ {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center font-bold text-[#2c1b0e]/60">
            <Loader2 size={24} className="animate-spin text-[#ff7b00] mr-2" /> Memuat data antrean bar...
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* GRID 3 KOLOM ANTREAN PROSES AKTIF */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {[ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING, ORDER_STATUS.READY].map((statusCode) => {
                const meta = statusMeta[statusCode]
                const Icon = meta.icon

                return (
                  <section key={statusCode} className="space-y-4 bg-white/40 border border-black/[0.02] p-4 rounded-[2.5rem]">
                    <h2
                      className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest border-b pb-2 ${
                        statusCode === ORDER_STATUS.PENDING
                          ? 'text-amber-600 border-amber-100'
                          : statusCode === ORDER_STATUS.PROCESSING
                            ? 'text-[#ff7b00] border-orange-100'
                            : 'text-emerald-600 border-emerald-100'
                      }`}
                    >
                      <Icon size={16} />
                      {meta.title} ({groupedActiveOrders[statusCode].length})
                    </h2>

                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                      {groupedActiveOrders[statusCode].length > 0 ? (
                        groupedActiveOrders[statusCode].map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onMoveStatus={moveStatus}
                            updatingOrderId={updatingOrderId}
                          />
                        ))
                      ) : (
                        <div className="rounded-[2rem] border-2 border-dashed border-gray-100 bg-white px-6 py-12 text-center text-xs font-bold text-gray-400">
                          Kosong
                        </div>
                      )}
                    </div>
                  </section>
                )
              })}
            </div>

            {/* SECTION BARU: RIWAYAT PESANAN SELESAI & DIAMBIL */}
            <section className="bg-white border border-black/[0.04] rounded-[2.5rem] p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                    <CheckSquare size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#2c1b0e]">Riwayat Ambil Selesai</h2>
                    <p className="text-xs text-gray-400 font-medium">Daftar produk yang sudah diserahkan ke tangan customer.</p>
                  </div>
                </div>

                {/* Search Bar Kecil */}
                <div className="relative max-w-xs w-full">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari ID / nama pelanggan..."
                    value={searchHistory}
                    onChange={(e) => setSearchHistory(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.06] bg-[#faf8f5] pl-9 pr-4 py-2 text-xs font-bold focus:border-[#ff7b00] focus:outline-none transition"
                  />
                </div>
              </div>

              {historyOrders.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-black/[0.03]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#2c1b0e] text-white font-black tracking-wider uppercase text-[10px]">
                        <th className="p-4 rounded-tl-2xl">ID Order</th>
                        <th className="p-4">Pelanggan</th>
                        <th className="p-4">Item Pesanan</th>
                        <th className="p-4">Waktu</th>
                        <th className="p-4 text-right">Total Pendapatan</th>
                        <th className="p-4 text-center rounded-tr-2xl">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
                      {historyOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-4 font-black text-[#2c1b0e]">#{order.id}</td>
                          <td className="p-4">
                            <span className="font-bold block text-[#2c1b0e]">{order.customerName}</span>
                            <span className="text-[10px] text-gray-400 font-bold">
                              {order.tableNumber ? `Meja ${order.tableNumber}` : 'Take Away'}
                            </span>
                          </td>
                          <td className="p-4 max-w-[240px] truncate">
                            {order.items?.map(it => `${it.name} (${it.quantity}x)`).join(', ') || '-'}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Calendar size={11} className="text-gray-400" />
                              <span>{order.infoTime} • {order.infoDate}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right font-black text-[#ff7b00]">
                            {formatRupiah(order.totalAmount || 0)}
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex rounded-full bg-emerald-100 border border-emerald-200 px-3 py-0.5 text-[9px] font-black uppercase text-emerald-800 tracking-wider shadow-sm">
                              SELESAI
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-gray-100 p-8 text-center text-xs font-bold text-gray-400">
                  Belum ada riwayat transaksi yang diselesaikan hari ini.
                </div>
              )}
            </section>

          </div>
        )}

        {lastUpdated ? (
          <p className="mt-8 text-xs text-gray-400 font-medium">
            Sinkronisasi otomatis TiDB aktif • Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
          </p>
        ) : null}
      </main>
    </div>
  )
}

export default OrderQueue