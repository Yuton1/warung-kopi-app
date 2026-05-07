import { Sparkles, Star, Ticket, Users } from 'lucide-react'

const benefits = [
  {
    icon: Ticket,
    title: 'Harga Prioritas',
    desc: 'Diskon spesial untuk menu favorit yang aktif hanya untuk member.',
  },
  {
    icon: Users,
    title: 'Antrian Khusus',
    desc: 'Layanan lebih cepat dengan prioritas pemesanan member.',
  },
  {
    icon: Sparkles,
    title: 'Voucher Eksklusif',
    desc: 'Voucher bulanan yang hanya tampil di halaman member.',
  },
  {
    icon: Star,
    title: 'Akses Menu Baru',
    desc: 'Coba menu terbaru lebih dulu sebelum pelanggan umum.',
  },
]

const BenefitList = () => {
  return (
    <section className="mt-12 md:mt-16">
      <div className="mb-8 text-center md:mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffb703]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#4a3728]">
          <Star className="h-3.5 w-3.5 text-[#ffb703]" />
          Benefit Member
        </div>
        <h2 className="font-display text-3xl font-bold text-[#4a3728]">Keuntungan Member</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[#7b6a5b] md:text-base">
          Nikmati berbagai keuntungan eksklusif sebagai member Warung Kopi.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon

          return (
            <article
              key={benefit.title}
              className="group rounded-[24px] border border-[#e9d8c8] bg-white/85 p-5 shadow-[0_16px_32px_rgba(45,25,15,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb703]/35 hover:shadow-[0_20px_36px_rgba(255,183,3,0.08)]"
              style={{ animationDelay: `${0.08 + index * 0.08}s` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffb703]/10 text-[#ffb703] transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-sm font-bold text-[#4a3728] md:text-[15px]">{benefit.title}</h3>
              <p className="text-xs leading-relaxed text-[#7b6a5b] md:text-[13px]">{benefit.desc}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default BenefitList
