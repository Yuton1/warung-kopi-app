import { ChevronDown, ChevronUp } from 'lucide-react'

const activeOrders = [
  {
    id: 'ORD-128',
    title: 'Ice Americano',
    category: 'Kopi',
    status: 'Proses',
    quantity: 2,
    price: 10000,
    currentStep: 2,
    time: '04:50 PM',
    date: 'Senin, 15-Januari-2025',
    note: 'Sabar yaaa!! pesanan kamu masih di proses oleh baristaa',
  },
  {
    id: 'ORD-129',
    title: 'Ice Americano',
    category: 'Kopi',
    status: 'Siap Di Ambil',
    quantity: 2,
    price: 10000,
    currentStep: 3,
    time: '04:55 PM',
    date: 'Senin, 15-Januari-2025',
    note: '',
  },
]

const historyOrders = [
  {
    id: 'HIS-001',
    title: 'Ice Americano',
    category: 'Kopi',
    status: 'Selesai',
    quantity: 1,
    price: 5000,
  },
  {
    id: 'HIS-002',
    title: 'Ice Americano',
    category: 'Kopi',
    status: 'Selesai',
    quantity: 1,
    price: 5000,
  },
]

const steps = ['Pemesanan', 'Pembayaran', 'Proses', 'Siap Diambil', 'Selesai']

const rupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`

const OrderCardHeader = ({ order }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex min-w-0 items-center gap-4">
      <div className="h-16 w-16 flex-none rounded-2xl bg-[#6f4630] shadow-inner" />
      <div className="min-w-0">
        <p className="text-[11px] leading-none text-[#8a6f58]">Kopi</p>
        <h3 className="truncate text-[20px] font-extrabold leading-tight text-[#1f140e]">
          {order.title}
        </h3>
        <span
          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-black leading-none ${
            order.status === 'Proses'
              ? 'bg-[#ffd24f] text-[#1f140e]'
              : order.status === 'Siap Di Ambil'
                ? 'bg-[#9ef06b] text-[#1f140e]'
                : 'bg-[#d8d8d8] text-[#1f140e]'
          }`}
        >
          {order.status}
        </span>
      </div>
    </div>

    <div className="flex flex-none flex-col items-end gap-1 text-right">
      <div className="min-w-[67px] rounded-md bg-[#ff7a00] px-3 py-1 text-center text-[16px] font-black leading-none text-white">
        {order.quantity}
      </div>
      <p className="text-[16px] font-black leading-none text-[#1f140e]">{rupiah(order.price)}</p>
    </div>
  </div>
)

const Timeline = ({ currentStep }) => {
  const stepColors = (index) => {
    if (index < currentStep) return 'bg-[#a9ee63] border-[#5a3d2a]'
    if (index === currentStep) return 'bg-[#ffc61a] border-[#5a3d2a]'
    return 'bg-[#f47b76] border-[#5a3d2a]'
  }

  return (
    <div className="px-5 pb-1 pt-8">
      <div className="relative">
        <div className="absolute left-0 top-[10px] h-1.5 w-full rounded-full bg-[#6b4b34]" />
        <div
          className="absolute left-0 top-[10px] h-1.5 rounded-full bg-[#ff8d1a] shadow-[0_0_8px_rgba(255,141,26,0.5)]"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        <div className="relative flex items-start justify-between">
          {steps.map((label, index) => (
            <div key={label} className="flex w-12 flex-col items-center">
              <div className={`z-10 h-5 w-5 rounded-full border-2 ${stepColors(index)}`} />
              <p className="mt-3 text-[9px] font-bold leading-none text-[#1f140e]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ExpandedOrderCard = ({ order }) => (
  <article className="rounded-[1.4rem] bg-[#f8efe4] p-3 shadow-[0_10px_18px_rgba(72,45,28,0.12)]">
    <OrderCardHeader order={order} />
    <Timeline currentStep={order.currentStep} />

    <div className="px-5 pb-2 pt-1 text-center">
      {order.note ? (
        <p className="mx-auto max-w-[28rem] text-[10px] font-medium leading-relaxed text-[#1f140e]">
          {order.note}
        </p>
      ) : null}
    </div>

    <div className="mt-2 flex items-center justify-center">
      <ChevronUp className="h-5 w-5 text-[#1f140e]" />
    </div>

    <div className="flex justify-end px-2 pb-2">
      <div className="text-right text-[9px] leading-tight text-[#6e6259]">
        <p className="uppercase tracking-tight">Informasi Pesanan</p>
        <p className="mt-0.5 font-black">{order.time}</p>
        <p>{order.date}</p>
      </div>
    </div>
  </article>
)

const CollapsedOrderCard = ({ order }) => (
  <article className="flex items-center justify-between rounded-[1.4rem] bg-[#f8efe4] p-3 shadow-[0_10px_18px_rgba(72,45,28,0.12)]">
    <OrderCardHeader order={order} />
    <div className="flex w-10 justify-center px-2">
      <ChevronDown className="h-5 w-5 text-[#1f140e]" />
    </div>
  </article>
)

const HistoryCard = ({ order }) => (
  <article className="flex items-center justify-between rounded-[1.4rem] bg-[#f8efe4] p-3 shadow-[0_10px_18px_rgba(72,45,28,0.12)]">
    <div className="flex min-w-0 items-center gap-4">
      <div className="h-16 w-16 flex-none rounded-2xl bg-[#6f4630] shadow-inner" />
      <div className="min-w-0">
        <p className="text-[11px] leading-none text-[#8a6f58]">Kopi</p>
        <h3 className="truncate text-[18px] font-extrabold leading-tight text-[#1f140e]">
          {order.title}
        </h3>
        <span className="mt-1 inline-flex rounded-full bg-[#d8d8d8] px-2 py-0.5 text-[9px] font-black leading-none text-[#1f140e]">
          {order.status}
        </span>
      </div>
    </div>

    <div className="flex flex-none flex-col items-end gap-1 text-right">
      <div className="min-w-[67px] rounded-md bg-[#ff7a00] px-3 py-1 text-center text-[16px] font-black leading-none text-white">
        {order.quantity}
      </div>
      <p className="text-[16px] font-black leading-none text-[#1f140e]">{rupiah(order.price)}</p>
    </div>
  </article>
)

const OrdersPage = () => {
  return (
    <div
      className="min-h-screen bg-[#f4e8da] px-4 py-6 text-[#1f140e] sm:px-6 lg:px-8"
      style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-10">
        <header className="pt-2">
          <p className="text-[12px] font-medium text-[#8b745d]">Yuk Lihat Progres pesanan kamu !!</p>
          <h1 className="mt-1 max-w-[12ch] text-[38px] font-black leading-[1.05] tracking-tight text-[#111111] sm:text-[44px]">
            Tracking status order
            <br />
            dan riwayat transaksi
          </h1>
        </header>

        <section className="rounded-[2rem] bg-[#9b724a] px-4 py-5 shadow-[0_20px_40px_rgba(96,64,36,0.18)] sm:px-6 sm:py-6">
          <p className="mb-1 text-[11px] text-[#f4e8da]/80">Periksa Ordermu di sini !!</p>
          <h2 className="text-[33px] font-black leading-none tracking-tight text-white sm:text-[37px]">
            Order Aktif
          </h2>

          <div className="mt-6 flex flex-col gap-4">
            <ExpandedOrderCard order={activeOrders[0]} />
            <CollapsedOrderCard order={activeOrders[1]} />
          </div>
        </section>

        <section className="rounded-[2rem] bg-[#9b724a] px-4 py-5 shadow-[0_20px_40px_rgba(96,64,36,0.18)] sm:px-6 sm:py-6">
          <p className="mb-1 text-[11px] text-[#f4e8da]/80">Kira kira kamu pesan apa saja ya minggu ini??</p>
          <h2 className="text-[33px] font-black leading-none tracking-tight text-white sm:text-[37px]">
            Riwayat Pesanan
          </h2>

          <div className="mt-6 flex flex-col gap-4">
            {historyOrders.map((order) => (
              <HistoryCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default OrdersPage
