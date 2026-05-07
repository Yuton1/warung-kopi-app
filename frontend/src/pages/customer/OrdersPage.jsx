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

const statusChip = (status) => {
  if (status === 'Proses') return 'bg-[#ffd84f] text-[#1c130f]'
  if (status === 'Siap Di Ambil') return 'bg-[#9ef06b] text-[#1c130f]'
  return 'bg-[#d9d9d9] text-[#1c130f]'
}

const OrderThumb = () => (
  <div className="h-[58px] w-[58px] flex-none rounded-[14px] bg-[#6d442e]" />
)

const OrderTopRow = ({ order }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <OrderThumb />
      <div className="min-w-0">
        <p className="text-[11px] leading-none text-[#8e7460]">Kopi</p>
        <h3 className="mt-1 truncate text-[19px] font-extrabold leading-[1] text-[#16110d]">
          {order.title}
        </h3>
        <span
          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-black leading-none ${statusChip(order.status)}`}
        >
          {order.status}
        </span>
      </div>
    </div>

    <div className="flex flex-none w-[96px] flex-col items-end gap-1 text-right">
      <div className="min-w-[66px] rounded-[4px] bg-[#ff7b00] px-3 py-1 text-center text-[16px] font-black leading-none text-white">
        {order.quantity}
      </div>
      <p className="text-[16px] font-black leading-none text-[#16110d]">{rupiah(order.price)}</p>
    </div>
  </div>
)

const Timeline = ({ currentStep }) => (
  <div className="px-6 pt-7">
    <div className="relative">
      <div className="absolute left-0 top-[9px] h-1.5 w-full rounded-full bg-[#6c4b34]" />
      <div
        className="absolute left-0 top-[9px] h-1.5 rounded-full bg-[#ff8d1a] shadow-[0_0_8px_rgba(255,141,26,0.5)]"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />

      <div className="relative flex items-start justify-between">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const dotClass = isCompleted
            ? 'bg-[#a8ee62]'
            : isCurrent
              ? 'bg-[#ffc61a]'
              : 'bg-[#f37c77]'

          return (
            <div key={label} className="flex w-[72px] flex-col items-center">
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

const CenterChevron = ({ up = false }) => (
  <div className="flex justify-center py-2">
    {up ? <ChevronUp className="h-5 w-5 text-[#16110d]" /> : <ChevronDown className="h-5 w-5 text-[#16110d]" />}
  </div>
)

const ExpandedOrderCard = ({ order }) => (
  <article className="rounded-[18px] bg-[#f7efdf] px-3 pb-3 pt-3 shadow-[0_10px_18px_rgba(72,45,28,0.12)]">
    <OrderTopRow order={order} />
    <Timeline currentStep={order.currentStep} />

    <div className="px-2 pt-3 text-center">
      <p className="mx-auto max-w-[380px] text-[10px] font-medium leading-relaxed text-[#1f140e]">
        {order.note}
      </p>
    </div>

    <CenterChevron up />

    <div className="flex justify-end px-2 pb-1">
      <div className="text-right text-[9px] leading-tight text-[#6f6257]">
        <p className="uppercase tracking-tight">Informasi Pesanan</p>
        <p className="mt-0.5 font-black">{order.time}</p>
        <p>{order.date}</p>
      </div>
    </div>
  </article>
)

const CollapsedOrderCard = ({ order }) => (
  <article className="rounded-[18px] bg-[#f7efdf] px-3 pb-2 pt-3 shadow-[0_10px_18px_rgba(72,45,28,0.12)]">
    <OrderTopRow order={order} />
    <CenterChevron />
  </article>
)

const HistoryCard = ({ order }) => (
  <article className="rounded-[18px] bg-[#f7efdf] px-3 pb-2 pt-3 shadow-[0_10px_18px_rgba(72,45,28,0.12)]">
    <OrderTopRow order={order} />
    <CenterChevron />
  </article>
)

const SectionShell = ({ eyebrow, title, children }) => (
  <section className="rounded-[28px] bg-[#a67b53] px-5 py-5 shadow-[0_20px_40px_rgba(96,64,36,0.18)] sm:px-7 sm:py-6">
    <p className="mb-1 text-[11px] font-medium text-[#f4e8da]/82">{eyebrow}</p>
    <h2 className="text-[34px] font-black leading-[1] tracking-tight text-white sm:text-[37px]">
      {title}
    </h2>
    <div className="mt-6 flex flex-col gap-4">{children}</div>
  </section>
)

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-[#f4e8da] px-4 py-5 text-[#16110d] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-10">
        <header className="pt-1">
          <p className="text-[12px] font-medium text-[#8b745d]">Yuk Lihat Progres pesanan kamu !!</p>
          <h1 className="mt-1 max-w-[13ch] text-[38px] font-black leading-[1.04] tracking-tight text-[#111111] sm:text-[43px]">
            Tracking status order
            <br />
            dan riwayat transaksi
          </h1>
        </header>

        <SectionShell eyebrow="Periksa Ordermu di sini !!" title="Order Aktif">
          <ExpandedOrderCard order={activeOrders[0]} />
          <CollapsedOrderCard order={activeOrders[1]} />
        </SectionShell>

        <SectionShell eyebrow="Kira kira kamu pesan apa saja ya minggu ini??" title="Riwayat Pesanan">
          {historyOrders.map((order) => (
            <HistoryCard key={order.id} order={order} />
          ))}
        </SectionShell>
      </div>
    </div>
  )
}

export default OrdersPage
