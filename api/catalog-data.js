const subscriptions = [
  {
    id: 'daily-boost',
    name: 'Daily Boost',
    quota: '5 Cup / Minggu',
    price: 99000,
    description: 'Paket ringan untuk pelanggan yang butuh kopi cepat setiap hari.',
    perks: ['Gratis upgrade size 2x', 'Reminder pickup', 'Diskon refill 10%'],
    accent: 'plan-amber',
  },
  {
    id: 'office-flow',
    name: 'Office Flow',
    quota: '10 Cup / Bulan',
    price: 179000,
    description: 'Cocok untuk kerja santai, meeting kecil, atau tim yang sering nongkrong.',
    perks: ['Bisa di-skip 1 minggu', 'Priority pickup', 'Poin ekstra 2x'],
    accent: 'plan-brown',
  },
  {
    id: 'shared-table',
    name: 'Shared Table',
    quota: '20 Cup / Bulan',
    price: 329000,
    description: 'Paket bulanan untuk tim, komunitas, atau grup nongkrong.',
    perks: ['Bisa dibagi 4 orang', 'Bonus menu favorit', 'Split payment ready'],
    accent: 'plan-cream',
  },
];

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
];

module.exports = {
  subscriptions,
  weeklyPromos,
};
