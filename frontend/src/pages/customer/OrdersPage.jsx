import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'

const ORDER_STEPS = ['Pemesanan', 'Pembayaran', 'Proses', 'Siap Diambil', 'Selesai']
const FALLBACK_IMAGE = '/Logo_Warkop_Nav.png'

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeText = (value) => String(value ?? '').trim()

const normalizeStatus = (value) => normalizeText(value).toLowerCase()

const rupiah = (value) => `Rp ${parseNumber(value).toLocaleString('id-ID')}`

const statusTone = (status) => {
  const normalized = normalizeStatus(status)

  if (['proses', 'diproses'].includes(normalized)) {
    return 'bg-[#ffd84f] text-[#1c130f]'
  }

  if (['siap diambil', 'siap_diambil'].includes(normalized)) {
    return 'bg-[#9ef06b] text-[#1c130f]'
  }

  if (['selesai', 'done', 'completed'].includes(normalized)) {
    return 'bg-[#d9d9d9] text-[#1c130f]'
  }

  if (['dibatalkan', 'cancelled'].includes(normalized)) {
    return 'bg-[#ff8f8f] text-[#1c130f]'
  }

  return 'bg-[#ffd84f] text-[#1c130f]'
}

const isHistoryStatus = (status) => {
  const normalized = normalizeStatus(status)
  return ['selesai', 'done', 'completed', 'dibatalkan', 'cancelled'].includes(normalized)
}

const formatOrderTime = (value) => {
  if (!value) return ''

  if (typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    const [hoursRaw, minutes] = value.split(':')
    const hours = Number(hoursRaw)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = ((hours + 11) % 12) + 1
    return `${String(displayHours).padStart(2, '0')}:${minutes} ${period}`
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return normalizeText(value)

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

const formatOrderDate = (value) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return normalizeText(value)

  const parts = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).formatToParts(date)

  const getPart = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${getPart('weekday')}, ${getPart('day')}-${getPart('month')}-${getPart('year')}`
}

const resolveImage = (value) => {
  const image = normalizeText(value)
  if (!image) return FALLBACK_IMAGE
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
    return image
  }
  return `/${image.replace(/^\/+/, '')}`
}

const normalizeOrderItem = (item) => {
  const quantity = parseNumber(item?.quantity)
  const priceAtTime = parseNumber(item?.priceAtTime ?? item?.price_at_time)

  return {
    id: item?.id ?? item?.itemId ?? item?.item_id ?? null,
    productId: item?.productId ?? item?.product_id ?? null,
    name: normalizeText(item?.name ?? item?.productName) || 'Menu',
    category: normalizeText(item?.category ?? item?.productCategory) || 'Menu',
    imageUrl: resolveImage(item?.imageUrl ?? item?.image_url ?? item?.productImage),
    quantity,
    priceAtTime,
    notes: normalizeText(item?.notes),
    subtotal: parseNumber(item?.subtotal, quantity * priceAtTime),
  }
}

const normalizeOrder = (order) => {
  const items = Array.isArray(order?.items) ? order.items.map(normalizeOrderItem) : []
  const primaryItem = normalizeOrderItem(order?.primaryItem || items[0] || {})
  const totalQuantity = parseNumber(
    order?.totalQuantity,
    items.reduce((sum, item) => sum + parseNumber(item.quantity), 0)
  )

  return {
    id: order?.id ?? order?.orderId ?? order?.order_id ?? null,
    status: normalizeText(order?.status || order?.statusLabel || 'Proses'),
    statusRaw: normalizeStatus(order?.statusRaw || order?.status || order?.statusLabel),
    totalAmount: parseNumber(order?.totalAmount ?? order?.total_amount, primaryItem.subtotal),
    totalQuantity,
    currentStep: parseNumber(order?.currentStep, 2),
    infoTime: normalizeText(order?.infoTime || formatOrderTime(order?.pickupTime || order?.createdAt)),
    infoDate: normalizeText(order?.infoDate || formatOrderDate(order?.createdAt || order?.pickupTime)),
    orderType: normalizeText(order?.orderType || order?.order_type),
    isPreorder: Boolean(order?.isPreorder ?? order?.is_preorder),
    tableNumber: order?.tableNumber ?? order?.table_number ?? null,
    pickupTime: order?.pickupTime ?? order?.pickup_time ?? null,
    pickupNote: normalizeText(order?.pickupNote || order?.pickup_note),
    createdAt: order?.createdAt ?? order?.created_at ?? null,
    primaryItem,
    items,
  }
}

const Timeline = ({ currentStep }) => (
  <div className="px-4 pt-6 sm:px-6">
    <div className="relative">
      <div className="absolute left-0 top-[9px] h-1.5 w-full rounded-full bg-[#6c4b34]" />
      <div
        className="absolute left-0 top-[9px] h-1.5 rounded-full bg-[#ff8d1a] shadow-[0_0_8px_rgba(255,141,26,0.5)]"
        style={{ width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%` }}
      />

      <div className="relative flex items-start justify-between gap-2">
        {ORDER_STEPS.map((label, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const dotClass = isCompleted
            ? 'bg-[#a8ee62]'
            : isCurrent
              ? 'bg-[#ffc61a]'
              : 'bg-[#f37c77]'

          return (
            <div key={label} className="flex w-[70px] flex-col items-center">
              <div className={`z-10 h-5 w-5 rounded-full border-2 border-[#5b3f2e] ${dotClass}`} />
              <p className="mt-3 whitespace-nowrap text-[9px] font-bold leading-none text-[#16110d]">
                {label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)

const OrderSummary = ({ order }) => {
  const primaryItem = order.primaryItem || {}

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="h-[58px] w-[58px] flex-none overflow-hidden rounded-[16px] bg-[#6d442e] shadow-inner sm:h-[66px] sm:w-[66px]">
          <img
            src={resolveImage(primaryItem.imageUrl)}
            alt={primaryItem.name || 'Menu'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] leading-none text-[#8e7460]">
            {primaryItem.category || 'Menu'}
          </p>
          <h3 className="mt-1 truncate text-[18px] font-extrabold leading-[1] text-[#16110d] sm:text-[20px]">
            {primaryItem.name || 'Menu'}
          </h3>
          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-black leading-none ${statusTone(
              order.statusRaw || order.status
            )}`}
          >
            {order.status || 'Proses'}
          </span>
        </div>
      </div>

      <div className="flex w-[100px] flex-none flex-col items-end gap-1 text-right">
        <div className="min-w-[66px] rounded-[4px] bg-[#ff7b00] px-3 py-1 text-center text-[16px] font-black leading-none text-white">
          {order.totalQuantity || primaryItem.quantity || 0}
        </div>
        <p className="text-[16px] font-black leading-none text-[#16110d]">
          {rupiah(order.totalAmount)}
        </p>
      </div>
    </div>
  )
}

const CenterChevron = ({ up = false }) => (
  <div className="flex justify-center py-2">
    {up ? (
      <ChevronUp className="h-5 w-5 text-[#16110d]" />
    ) : (
      <ChevronDown className="h-5 w-5 text-[#16110d]" />
    )}
  </div>
)

const OrderCard = ({ order, expanded, onToggle, showTracking = true }) => {
  const note =
    order.pickupNote ||
    (order.statusRaw === 'selesai'
      ? 'Pesanan sudah selesai dan siap dinikmati.'
      : 'Sabar yaaa!! pesanan kamu masih di proses oleh baristaa')

  return (
    <article className="rounded-[20px] bg-[#f7efdf] px-3 pb-3 pt-3 shadow-[0_10px_18px_rgba(72,45,28,0.12)] sm:px-4">
      <button
        type="button"
        onClick={showTracking ? onToggle : undefined}
        className="block w-full text-left"
      >
        <OrderSummary order={order} />
      </button>

      {showTracking && expanded ? (
        <div>
          <Timeline currentStep={order.currentStep} />

          <div className="px-4 pt-3 text-center sm:px-6">
            <p className="mx-auto max-w-[480px] text-[10px] font-medium leading-relaxed text-[#1f140e]">
              {note}
            </p>
          </div>

          <CenterChevron up />

          <div className="flex justify-end px-2 pb-1">
            <div className="text-right text-[9px] leading-tight text-[#6f6257]">
              <p className="uppercase tracking-tight">Informasi Pesanan</p>
              <p className="mt-0.5 font-black">{order.infoTime}</p>
              <p>{order.infoDate}</p>
            </div>
          </div>
        </div>
      ) : (
        <CenterChevron />
      )}
    </article>
  )
}

const SectionShell = ({ eyebrow, title, children }) => (
  <section className="w-full rounded-[30px] bg-[#a67b53] px-5 py-5 shadow-[0_20px_40px_rgba(96,64,36,0.18)] sm:px-7 sm:py-6">
    <p className="mb-1 text-[11px] font-medium text-[#f4e8da]/82">{eyebrow}</p>
    <h2 className="text-[32px] font-black leading-[1.02] tracking-tight text-white sm:text-[38px]">
      {title}
    </h2>
    <div className="mt-6 flex flex-col gap-4">{children}</div>
  </section>
)

const EmptyState = ({ title, description }) => (
  <div className="rounded-[20px] border border-dashed border-[#d8c2ac] bg-[#f7efdf] px-4 py-6 text-center text-[#6f6257]">
    <p className="text-sm font-bold text-[#16110d]">{title}</p>
    <p className="mt-1 text-xs">{description}</p>
  </div>
)

const OrdersPage = () => {
  const [authUser, setAuthUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null))
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  const API_BASE_URL = getApiBaseUrl()

  useEffect(() => {
    const syncAuth = () => setAuthUser(readStoredValue(STORAGE_KEYS.auth, null))

    syncAuth()
    window.addEventListener('storage', syncAuth)
    window.addEventListener('warungkopi-state-changed', syncAuth)

    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('warungkopi-state-changed', syncAuth)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadOrders = async () => {
      if (!authUser?.email) {
        setOrders([])
        setLoading(false)
        setError('')
        return
      }

      setLoading(true)
      setError('')

      try {
        const baseUrl = API_BASE_URL ? `${API_BASE_URL}/api/orders` : '/api/orders'
        const response = await fetch(`${baseUrl}?userEmail=${encodeURIComponent(authUser.email)}`)

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []

        if (!cancelled) {
          setOrders(list.map(normalizeOrder))
        }
      } catch (fetchError) {
        console.error('Gagal memuat pesanan:', fetchError)

        if (!cancelled) {
          setOrders([])
          setError('Pesanan belum dapat dimuat dari TiDB.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      cancelled = true
    }
  }, [API_BASE_URL, authUser?.email])

  const activeOrders = useMemo(
    () => orders.filter((order) => !isHistoryStatus(order.statusRaw || order.status)),
    [orders]
  )

  const historyOrders = useMemo(
    () => orders.filter((order) => isHistoryStatus(order.statusRaw || order.status)),
    [orders]
  )

  useEffect(() => {
    if (!activeOrders.length) {
      setExpandedOrderId(null)
      return
    }

    const firstActiveId = activeOrders[0]?.id
    const stillExists = activeOrders.some((order) => order.id === expandedOrderId)

    if (!stillExists) {
      setExpandedOrderId(firstActiveId)
    }
  }, [activeOrders, expandedOrderId])

  const toggleExpanded = (orderId) => {
    setExpandedOrderId((current) => (current === orderId ? null : orderId))
  }

  return (
    <div className="min-h-screen bg-[#f4e8da] px-4 py-6 text-[#16110d] sm:px-6 lg:px-10 xl:px-14">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-10">
        <header className="pt-1">
          <p className="text-[12px] font-medium text-[#8b745d]">Yuk Lihat Progres pesanan kamu !!</p>
          <h1 className="mt-2 max-w-[14ch] text-[40px] font-black leading-[1.03] tracking-tight text-[#111111] sm:text-[54px]">
            Tracking status order
            <br />
            dan riwayat transaksi
          </h1>
        </header>

        <SectionShell eyebrow="Periksa Ordermu di sini !!" title="Order Aktif">
          {loading ? (
            <EmptyState title="Memuat pesanan..." description="Sedang mengambil data order dari TiDB." />
          ) : error ? (
            <EmptyState title="Pesanan belum tersedia" description={error} />
          ) : activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedOrderId === order.id}
                onToggle={() => toggleExpanded(order.id)}
                showTracking
              />
            ))
          ) : (
            <EmptyState
              title="Belum ada order aktif"
              description="Order yang sedang diproses akan muncul di sini."
            />
          )}
        </SectionShell>

        <SectionShell eyebrow="Kira kira kamu pesan apa saja ya minggu ini??" title="Riwayat Pesanan">
          {historyOrders.length > 0 ? (
            historyOrders.map((order) => (
              <OrderCard key={order.id} order={order} expanded={false} showTracking={false} />
            ))
          ) : (
            <EmptyState
              title="Riwayat masih kosong"
              description="Pesanan yang sudah selesai akan tampil di bagian ini."
            />
          )}
        </SectionShell>
      </div>
    </div>
  )
}

export default OrdersPage
