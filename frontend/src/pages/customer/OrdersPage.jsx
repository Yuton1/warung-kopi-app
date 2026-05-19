import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Coffee, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
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

const mapStatusToStep = (statusString) => {
  const status = normalizeStatus(statusString)
  if (status === 'pending') return 0
  if (status === 'paid') return 1
  if (['proses', 'processing', 'diproses'].includes(status)) return 2
  if (['siap diambil', 'siap_diambil', 'ready'].includes(status)) return 3
  if (['selesai', 'done', 'completed'].includes(status)) return 4
  return 2 
}

// Badge status disesuaikan dengan warna aksen di gambar (Orange pekat & Hijau terang)
const statusTone = (status) => {
  const normalized = normalizeStatus(status)
  if (['proses', 'processing', 'diproses'].includes(normalized)) return 'bg-[#ff7b00] text-white'
  if (['siap diambil', 'siap_diambil', 'ready'].includes(normalized)) return 'bg-[#9ef06b] text-[#1c130f]'
  if (['selesai', 'done', 'completed'].includes(normalized)) return 'bg-emerald-600 text-white'
  if (['dibatalkan', 'cancelled'].includes(normalized)) return 'bg-rose-600 text-white'
  return 'bg-[#ff7b00] text-white'
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
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date)
}

const formatOrderDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return normalizeText(value)
  const parts = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).formatToParts(date)
  const getPart = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${getPart('weekday')}, ${getPart('day')}-${getPart('month')}-${getPart('year')}`
}

const resolveImage = (value) => {
  const image = normalizeText(value)
  if (!image) return FALLBACK_IMAGE
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) return image
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
  const primaryItem = normalizeOrderItem(order?.primaryItem || items || {})
  const totalQuantity = parseNumber(order?.totalQuantity, items.reduce((sum, item) => sum + parseNumber(item.quantity), 0))
  const dbStatus = normalizeText(order?.status || order?.statusLabel || 'Proses')

  return {
    id: order?.id ?? order?.orderId ?? order?.order_id ?? null,
    status: dbStatus,
    statusRaw: normalizeStatus(order?.statusRaw || order?.status || order?.statusLabel),
    totalAmount: parseNumber(order?.totalAmount ?? order?.total_amount, primaryItem.subtotal),
    totalQuantity,
    currentStep: mapStatusToStep(dbStatus),
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

// Timeline tracker horizontal dengan warna senada dashboard pengelola (TiDB)
const Timeline = ({ currentStep }) => {
  return (
    <div className="px-2 pt-6 sm:px-4 bg-[#1e140f]/40 rounded-2xl p-4 border border-white/5 mb-4">
      <div className="relative">
        
        {/* DESKTOP TIMELINE */}
        <div className="hidden md:block absolute left-8 right-8 top-[9px] h-1.5 rounded-full bg-[#ff7b00]/20" />
        <div
          className="hidden md:block absolute left-8 top-[9px] h-1.5 rounded-full bg-gradient-to-r from-[#ff7b00] to-[#9ef06b] transition-all duration-1000 ease-out line-wave-loading shadow-[0_0_10px_rgba(255,123,0,0.4)]"
          style={{ width: `calc(${(currentStep / (ORDER_STEPS.length - 1)) * 100}% - 4rem)` }}
        />

        <div className="flex flex-col md:flex-row justify-between gap-5 md:gap-2 relative z-10">
          {ORDER_STEPS.map((label, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep

            return (
              <div key={label} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 md:w-24 group">
                {/* Bulatan Node */}
                <div className={`h-6 w-6 rounded-full border-4 border-[#241710] z-10 flex items-center justify-center text-[10px] font-black transition-all duration-500
                  ${isCompleted 
                    ? 'bg-[#9ef06b] text-[#1c130f] shadow-md' 
                    : isCurrent 
                      ? 'bg-[#ff7b00] text-white step-active-glow' 
                      : 'bg-[#38261c] text-white/30'}`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                
                {/* Teks Deskripsi */}
                <div className="text-left md:text-center">
                  <p className={`text-xs font-black transition-all duration-300 ${isCurrent ? 'text-[#ff7b00] scale-105' : isCompleted ? 'text-white' : 'text-white/50'}`}>
                    {label}
                  </p>
                </div>

                {/* MOBILE TIMELINE */}
                {index < ORDER_STEPS.length - 1 && (
                  <div className="md:hidden absolute left-[11px] ml-[-1px] w-[2px] h-6 bg-[#ff7b00]/20 mt-7 -z-10">
                    <div className={`w-full h-full bg-[#ff7b00] transition-all duration-500 ${index < currentStep ? 'h-full' : 'h-0'}`}></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

const OrderSummary = ({ order }) => {
  const primaryItem = order.primaryItem || {}

  return (
    <div className="flex items-center justify-between gap-4 p-1">
      <div className="flex min-w-0 items-center gap-4">
        <div className="h-[62px] w-[62px] flex-none overflow-hidden rounded-2xl bg-[#1e140f] shadow-md border border-black/10">
          <img
            src={resolveImage(primaryItem.imageUrl)}
            alt={primaryItem.name || 'Menu'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#ff7b00]">
            {primaryItem.category || 'Menu'}
          </p>
          <h3 className="mt-0.5 truncate text-lg font-black tracking-tight text-[#241710]">
            {primaryItem.name || 'Menu'}
          </h3>
          <span className={`mt-1.5 inline-flex rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm ${statusTone(order.statusRaw || order.status)}`}>
            {order.status || 'Proses'}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 text-right flex-none">
        <div className="min-w-[50px] rounded-lg bg-[#241710] px-2.5 py-0.5 text-center text-xs font-black text-[#fffaf0] shadow-sm">
          {order.totalQuantity || primaryItem.quantity || 0}x
        </div>
        <p className="text-lg font-black tracking-tight text-[#241710]">
          {rupiah(order.totalAmount)}
        </p>
      </div>
    </div>
  )
}

const OrderCard = ({ order, expanded, onToggle, showTracking = true }) => {
  const note = order.pickupNote || (order.currentStep === 3 
    ? 'Hore! Kopimu sudah matang, yuk langsung ambil di meja bar 🏃💨'
    : order.statusRaw === 'selesai'
      ? 'Pesanan sudah selesai dan siap dinikmati.'
      : 'Sabar yaaa!! pesanan kamu masih di proses oleh baristaa')

  return (
    // Menggunakan warna krem background utama (#fffaf0) agar menyatu dengan bagian bawah UI kamu
    <article className="group rounded-[2rem] bg-[#fffaf0] p-4 shadow-[0_4px_20px_rgba(30,20,15,0.05)] hover:shadow-[0_12px_30px_rgba(30,20,15,0.1)] transition-all duration-300 border border-black/[0.03]">
      <button
        type="button"
        onClick={showTracking ? onToggle : undefined}
        className="block w-full text-left focus:outline-none"
      >
        <OrderSummary order={order} />
        {showTracking && (
          <div className="flex justify-center mt-2 pt-1 border-t border-[#1e140f]/5">
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-[#ff7b00] animate-pulse" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#241710]/40 group-hover:translate-y-0.5 transition-transform" />
            )}
          </div>
        )}
      </button>

      {showTracking && expanded && (
        <div className="mt-2 pt-2 border-t border-[#1e140f]/5 animate-fadeIn">
          <Timeline currentStep={order.currentStep} />

          <div className="px-2 pt-2 text-center">
            <p className="mx-auto max-w-[480px] text-xs italic font-medium text-white/90">
              "{note}"
            </p>
          </div>

          <div className="flex justify-between items-end mt-4 pt-3 border-t border-white/10 px-1 text-[10px] text-white/60 font-medium">
            <div>
              <span className="block text-[8px] uppercase tracking-wider opacity-60">Waktu Transaksi</span>
              <span className="font-bold text-white">{order.infoTime}</span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] uppercase tracking-wider opacity-60">Tanggal</span>
              <span className="font-bold text-white">{order.infoDate}</span>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

// Shell Box diubah menjadi Cokelat Tua Gelap Pekat (#241710) sesuai kontainer utama Promo Minggu Ini
const SectionShell = ({ title, icon: Icon, children }) => (
  <section className="w-full rounded-[2.5rem] bg-[#241710] p-6 md:p-8 shadow-[0_15px_35px_rgba(30,20,15,0.2)] border border-white/[0.02]">
    <div className="flex items-center gap-2.5 mb-6">
      {Icon && <Icon className="w-6 h-6 text-[#ff7b00]" />}
      <h2 className="text-2xl font-black tracking-tight text-white">{title}</h2>
    </div>
    <div className="flex flex-col gap-4">{children}</div>
  </section>
)

const EmptyState = ({ title, description, isLoading = false }) => (
  <div className="rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-white/80 backdrop-blur-sm">
    {isLoading ? (
      <RefreshCw className="w-8 h-8 mx-auto text-[#ff7b00] animate-spin mb-3" />
    ) : (
      <AlertCircle className="w-8 h-8 mx-auto text-[#ff7b00] mb-3" />
    )}
    <p className="text-base font-black text-white">{title}</p>
    <p className="mt-1 text-xs text-white/50">{description}</p>
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
        return
      }
      setLoading(true)
      setError('')

      try {
        const baseUrl = API_BASE_URL ? `${API_BASE_URL}/api/orders` : '/api/orders'
        const response = await fetch(`${baseUrl}?userEmail=${encodeURIComponent(authUser.email)}`)
        if (!response.ok) throw new Error(`Status ${response.status}`)
        const payload = await response.json()
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
        if (!cancelled) setOrders(list.map(normalizeOrder))
      } catch (fetchError) {
        console.error('Gagal memuat pesanan:', fetchError)
        if (!cancelled) {
          setOrders([])
          setError('Gagal menarik data antrean terbaru.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadOrders()
    return () => { cancelled = true }
  }, [API_BASE_URL, authUser?.email])

  const activeOrders = useMemo(() => orders.filter((order) => !isHistoryStatus(order.statusRaw || order.status)), [orders])
  const historyOrders = useMemo(() => orders.filter((order) => isHistoryStatus(order.statusRaw || order.status)), [orders])

  useEffect(() => {
    if (!activeOrders.length) {
      setExpandedOrderId(null)
      return
    }
    const firstActiveId = activeOrders?.id
    const stillExists = activeOrders.some((order) => order.id === expandedOrderId)
    if (!stillExists) setExpandedOrderId(firstActiveId)
  }, [activeOrders, expandedOrderId])

  const toggleExpanded = (orderId) => {
    setExpandedOrderId((current) => (current === orderId ? null : orderId))
  }

  return (
    // Background utama halaman dibuat off-white bersih agar kontras dengan card cokelat gelap
    <div className="min-h-screen w-full px-4 py-8 text-[#241710] sm:px-6 lg:px-8 bg-[#faf6f0]">
      
      {/* INJECT ANIMASI CSS */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,123,0, 0.5); }
          50% { transform: scale(1.1); box-shadow: 0 0 12px 4px rgba(255,123,0, 0); }
        }
        @keyframes waveMove {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-active-glow { animation: pulseGlow 2s infinite; }
        .line-wave-loading {
          background-image: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent);
          background-size: 1rem 1rem;
          animation: waveMove 1s linear infinite;
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>

      <div className="mx-auto w-full max-w-7xl flex flex-col gap-8">
        
        {/* HEADER */}
        <header className="px-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#ff7b00] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> Live Tracking
          </p>
          <h1 className="mt-1 text-3xl font-black leading-none tracking-tight text-[#241710] sm:text-4xl md:text-5xl">
            Status & Riwayat Pesanan
          </h1>
        </header>

        {/* SECTION 1: ORDER AKTIF */}
        <SectionShell title="Order Aktif" icon={Coffee}>
          {loading ? (
            <EmptyState title="Memuat Data Antrean..." description="Sedang mensinkronisasikan data dengan TiDB." isLoading />
          ) : error ? (
            <EmptyState title="Koneksi Bermasalah" description={error} />
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
            <EmptyState title="Belum Ada Order Aktif" description="Pesanan yang sedang disiapkan oleh barista akan muncul di sini." />
          )}
        </SectionShell>

        {/* SECTION 2: RIWAYAT PESANAN */}
        <SectionShell title="Riwayat Pesanan" icon={CheckCircle2}>
          {loading ? (
            <EmptyState title="Memuat Riwayat..." description="Sedang memanggil riwayat transaksi kamu." isLoading />
          ) : historyOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyOrders.map((order) => (
                <OrderCard key={order.id} order={order} expanded={false} showTracking={false} />
              ))}
            </div>
          ) : (
            <EmptyState title="Riwayat Masih Kosong" description="Selesaikan pesanan pertamamu untuk melihat riwayat belanja." />
          )}
        </SectionShell>

      </div>
    </div>
  )
}

export default OrdersPage