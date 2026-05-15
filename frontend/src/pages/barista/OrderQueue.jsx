import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { fetchBaristaQueue, updateBaristaOrderStatus } from '../../services/baristaOrderService'
import { formatRupiah } from '../../utils/formatRupiah'
import { CheckCircle, Clock, Coffee, Package, RefreshCw, User, Loader2 } from 'lucide-react'

const ORDER_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  READY: 2,
}

const toStatusCode = (order) => {
  const numeric = Number(order?.statusRaw ?? order?.status)
  if (Number.isFinite(numeric)) {
    return numeric
  }

  const normalized = String(order?.status ?? '').toLowerCase()
  if (normalized.includes('process')) return ORDER_STATUS.PROCESSING
  if (normalized.includes('ready') || normalized.includes('siap')) return ORDER_STATUS.READY
  return ORDER_STATUS.PENDING
}

const statusMeta = {
  [ORDER_STATUS.PENDING]: {
    label: 'New',
    chip: 'bg-orange-100 text-orange-700',
    panel: 'border-orange-100 bg-white',
    button: 'bg-[#2c1b0e] hover:bg-[#4A3728] text-white',
    title: 'Antrean Baru (FIFO)',
    actionLabel: 'Proses',
    icon: Clock,
  },
  [ORDER_STATUS.PROCESSING]: {
    label: 'Processing',
    chip: 'bg-blue-100 text-blue-700',
    panel: 'border-blue-100 bg-blue-50',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    title: 'Sedang Diseduh',
    actionLabel: 'Set Ready',
    icon: Coffee,
  },
  [ORDER_STATUS.READY]: {
    label: 'Ready',
    chip: 'bg-green-100 text-green-700',
    panel: 'border-green-100 bg-green-50',
    button: 'bg-green-600 hover:bg-green-700 text-white',
    title: 'Siap Diambil',
    actionLabel: null,
    icon: Package,
  },
}

const OrderCard = ({ order, onMoveStatus, updatingOrderId }) => {
  const statusCode = toStatusCode(order)
  const meta = statusMeta[statusCode] || statusMeta[ORDER_STATUS.PENDING]
  const isUpdating = updatingOrderId === order.id
  const primaryItem = order.items?.[0]

  return (
    <div className={`rounded-[2rem] border p-6 shadow-sm transition-all hover:shadow-md ${meta.panel}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${meta.chip}`}>
            {meta.label}
          </div>
          <h3 className="mt-3 text-xl font-black text-[#2c1b0e]">
            Order #{order.id}
          </h3>
          <p className="text-sm text-gray-500">
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
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Waktu</p>
          <p className="font-bold text-[#2c1b0e]">{order.infoTime || '-'}</p>
          <p className="text-xs text-gray-400">{order.infoDate || ''}</p>
        </div>
      </div>

      <div className="mb-4 rounded-[1.5rem] bg-white/80 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2c1b0e] text-white">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Pesanan</p>
            <p className="truncate text-lg font-bold text-[#2c1b0e]">
              {primaryItem?.name || `${order.items?.length || 0} item`}
            </p>
            <p className="text-sm text-gray-500">
              {order.items?.length || 0} item • {formatRupiah(order.totalAmount || 0)}
            </p>
          </div>
        </div>

        {order.pickupNote ? (
          <p className="mt-3 rounded-xl bg-[#FDF7F2] px-3 py-2 text-sm text-[#6b4f3a]">
            {order.pickupNote}
          </p>
        ) : null}

        {order.items?.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-[#4A3728]">
            {order.items.map((item) => (
              <li key={`${order.id}-${item.id}`} className="flex items-center justify-between gap-4 rounded-xl bg-[#FDF7F2] px-3 py-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {item.name} <span className="text-gray-400">x {item.quantity}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.size || 'Normal'}
                    {item.notes ? ` • ${item.notes}` : ''}
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {formatRupiah(item.subtotal || item.priceAtTime * item.quantity || 0)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">
          Total {formatRupiah(order.totalAmount || 0)}
        </p>
        {meta.actionLabel ? (
          <button
            type="button"
            onClick={() => onMoveStatus(order.id, statusCode === ORDER_STATUS.PENDING ? ORDER_STATUS.PROCESSING : ORDER_STATUS.READY)}
            disabled={isUpdating}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-95 disabled:opacity-70 ${meta.button}`}
          >
            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {meta.actionLabel}
          </button>
        ) : (
          <span className="rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white">
            READY
          </span>
        )}
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

  const groupedOrders = useMemo(() => {
    const buckets = {
      [ORDER_STATUS.PENDING]: [],
      [ORDER_STATUS.PROCESSING]: [],
      [ORDER_STATUS.READY]: [],
    }

    orders.forEach((order) => {
      const statusCode = toStatusCode(order)
      if (buckets[statusCode]) {
        buckets[statusCode].push(order)
      }
    })

    return buckets
  }, [orders])

  const moveStatus = async (id, nextStatus) => {
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
    <div className="flex min-h-screen bg-[#F8F9FA] overflow-hidden font-['Fredoka']">
      <Sidebar role="barista" />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[#2c1b0e]">Order Queue</h1>
            <p className="text-gray-500">Pantau pesanan dari TiDB dan ubah statusnya langsung dari sini.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadQueue(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#2c1b0e] shadow-sm transition hover:bg-[#f6efe7]"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div className="rounded-2xl bg-[#2c1b0e] px-5 py-3 text-white shadow-lg">
              <span className="text-sm font-bold">
                {groupedOrders[ORDER_STATUS.PENDING].length} Pesanan Baru
              </span>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-[#2c1b0e]">
            Memuat antrean pesanan...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {[
              ORDER_STATUS.PENDING,
              ORDER_STATUS.PROCESSING,
              ORDER_STATUS.READY,
            ].map((statusCode) => {
              const meta = statusMeta[statusCode]
              const Icon = meta.icon

              return (
                <section key={statusCode} className="space-y-5">
                  <h2 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] ${
                    statusCode === ORDER_STATUS.PENDING
                      ? 'text-[#e39b4f]'
                      : statusCode === ORDER_STATUS.PROCESSING
                        ? 'text-blue-600'
                        : 'text-green-600'
                  }`}>
                    <Icon size={18} />
                    {meta.title}
                  </h2>

                  <div className="space-y-4">
                    {groupedOrders[statusCode].length > 0 ? (
                      groupedOrders[statusCode].map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onMoveStatus={moveStatus}
                          updatingOrderId={updatingOrderId}
                        />
                      ))
                    ) : (
                      <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-gray-400">
                        Tidak ada pesanan pada kolom ini.
                      </div>
                    )}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        {lastUpdated ? (
          <p className="mt-8 text-xs text-gray-400">
            Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
          </p>
        ) : null}
      </main>
    </div>
  )
}

export default OrderQueue
