import { Activity, Check, ExternalLink, Home, Package, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  { label: 'Order Confirmed', icon: Check, state: 'completed' },
  { label: 'Being Prepared', icon: Check, state: 'completed' },
  { label: 'Out for Delivery', icon: Truck, state: 'active' },
  { label: 'Delivered', icon: Home, state: 'pending' },
]

const ShippingAddress = ({ order }) => {
  return (
    <article className="surface-card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon brown">
            <Package className="h-[22px] w-[22px]" />
          </div>
          <div>
            <h3>Shipping Address</h3>
            <p>Active order delivery tracking</p>
          </div>
        </div>
        <Link to="/pesanan" className="card-action">
          <ExternalLink className="h-[14px] w-[14px]" />
          View Order
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] bg-gradient-to-br from-[#5b3927] to-[#9c6d48] p-5 text-[#fff7ef]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-[#9ef06b]" />
            Order #{order.id} - {order.status}
          </div>

          <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">Delivering To</p>
          <h4 className="mt-1 text-xl font-black">{order.recipient}</h4>

          <div className="mt-4 rounded-2xl bg-white/10 p-4">
            <p className="text-sm leading-6 text-white/85">{order.address}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
              <Activity className="h-4 w-4" />
              {order.phone}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-[#f8f1e8] p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#4b3729]">
            <Activity className="h-4 w-4 text-[#c9a96e]" />
            Order Tracking
          </div>

          <div className="space-y-4">
            {steps.map((step) => {
              const isCompleted = step.state === 'completed'
              const isActive = step.state === 'active'
              const StepIcon = step.icon

              return (
                <div key={step.label} className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 ${
                      isCompleted
                        ? 'border-[#88b65f] bg-[#88b65f] text-white'
                        : isActive
                          ? 'border-[#c9a96e] bg-[#c9a96e] text-white'
                          : 'border-[#ccb39c] bg-white text-[#9a8370]'
                    }`}
                  >
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-bold text-[#4b3729]">{step.label}</h4>
                    <p className="text-xs text-[#8c7661]">
                      {isCompleted
                        ? 'Step selesai'
                        : isActive
                          ? 'Sedang berjalan'
                          : 'Menunggu proses berikutnya'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ShippingAddress
