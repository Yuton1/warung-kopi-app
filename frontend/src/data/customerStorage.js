export const STORAGE_KEYS = {
  account: 'warungkopi.account',
  auth: 'warungkopi.auth',
  cart: 'warungkopi.cart',
  favorites: 'warungkopi.favorites',
  groupOrder: 'warungkopi.groupOrder',
  history: 'warungkopi.history',
  loyalty: 'warungkopi.loyalty',
  preorder: 'warungkopi.preorder',
  profile: 'warungkopi.profile',
  subscription: 'warungkopi.subscription',
}

export const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export const readStoredValue = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  return safeParse(window.localStorage.getItem(key), fallback)
}

export const writeStoredValue = (key, value) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}
