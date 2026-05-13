import { STORAGE_KEYS, readStoredValue, writeStoredValue } from './customerStorage'

export const DEFAULT_BANNERS = [
  {
    id: 'banner-1',
    title: 'Promo Mingguan',
    subtitle: 'Jangan Sampai Kelewatan',
    description: 'Nikmati promo spesial untuk minuman favorit dan menu pilihan selama periode terbatas.',
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    target_url: '/promo',
    button_label: 'Lihat Promo',
  },
  {
    id: 'banner-2',
    title: 'Voucher Member',
    subtitle: 'Kumpulkan Poin Sekarang',
    description: 'Bangun poin membership dan tukarkan dengan voucher menarik atau hadiah eksklusif.',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    target_url: '/member',
    button_label: 'Lihat Detail',
  },
]

const normalizeBanner = (item, index) => ({
  id: item?.id ?? `banner-${index + 1}`,
  title: String(item?.title ?? '').trim(),
  subtitle: String(item?.subtitle ?? '').trim(),
  description: String(item?.description ?? '').trim(),
  image_url: String(item?.image_url ?? item?.imageUrl ?? '').trim(),
  target_url: String(item?.target_url ?? item?.targetUrl ?? '/').trim() || '/',
  button_label: String(item?.button_label ?? item?.buttonLabel ?? 'Detail').trim() || 'Detail',
})

export const readBannerList = () => {
  const storedBanners = readStoredValue(STORAGE_KEYS.banners, null)

  if (storedBanners === null || typeof storedBanners === 'undefined') {
    return DEFAULT_BANNERS
  }

  if (!Array.isArray(storedBanners)) {
    return DEFAULT_BANNERS
  }

  return storedBanners.map(normalizeBanner)
}

export const saveBannerList = (items) => {
  const normalized = Array.isArray(items) ? items.map(normalizeBanner) : []
  writeStoredValue(STORAGE_KEYS.banners, normalized)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('warungkopi-state-changed'))
  }

  return normalized
}

export const createBlankBanner = () => ({
  id: null,
  title: '',
  subtitle: '',
  description: '',
  image_url: '',
  target_url: '/promo',
  button_label: 'Detail',
})
