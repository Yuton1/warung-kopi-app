const weeklyPromos = [
  {
    id: 'morning-boost',
    title: 'Morning Boost 1+1',
    description: 'Beli 1 Latte Gula Aren, gratis 1 Americano ukuran Tall sampai jam 11.00.',
    code: 'BOOST2KOPI',
    badge: 'Hemat pagi',
    accent: 'promo-amber',
    remaining_quota: 12,
    is_claimed: false,
    unique_code: null,
  },
  {
    id: 'bundle-couple',
    title: 'Bundle Nongkrong 2-4 Orang',
    description: 'Diskon 15% untuk 2 minuman + 1 pastry, cocok buat pasangan atau teman nongkrong.',
    code: 'NGOPI15',
    badge: 'Bundling',
    accent: 'promo-brown',
    remaining_quota: 8,
    is_claimed: false,
    unique_code: null,
  },
  {
    id: 'loyalty-week',
    title: 'Minggu Loyalty Double Point',
    description: 'Setiap order dari halaman ini mendapatkan poin loyalty 2x selama promo aktif.',
    code: '2XPOINT',
    badge: 'Points',
    accent: 'promo-cream',
    remaining_quota: 15,
    is_claimed: false,
    unique_code: null,
  },
]

const subscriptions = [
  {
    id: 'daily-boost',
    name: 'Daily Boost',
    description: '5 cup kopi pilihan per minggu untuk pelanggan yang selalu on the go.',
    price: 99000,
    quota: '5 Cup / Minggu',
    accent: 'plan-amber',
  },
  {
    id: 'office-flow',
    name: 'Office Flow',
    description: '10 cup campuran kopi dan non-kopi untuk kerja santai atau tim kecil.',
    price: 179000,
    quota: '10 Cup / Bulan',
    accent: 'plan-brown',
  },
  {
    id: 'shared-table',
    name: 'Shared Table',
    description: 'Paket langganan bulanan untuk tim, komunitas, atau grup nongkrong.',
    price: 329000,
    quota: '20 Cup / Bulan',
    accent: 'plan-cream',
  },
]

module.exports = {
  weeklyPromos,
  subscriptions,
}
