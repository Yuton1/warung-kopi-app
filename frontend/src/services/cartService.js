import axios from 'axios'
import { STORAGE_KEYS, readStoredValue, writeStoredValue } from '../data/customerStorage'
import { getApiBaseUrl } from '../utils/apiBaseUrl'

const DEFAULT_SIZE = {
  label: 'Normal',
  note: '',
  factor: 1,
}

const FALLBACK_IMAGE = '/Logo_Warkop_Nav.png'

const getCartApiUrl = () => {
  const baseUrl = getApiBaseUrl()
  return baseUrl ? `${baseUrl}/api/cart` : '/api/cart'
}

const dispatchCartChange = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('warungkopi-state-changed'))
}

const getAuthIdentity = () => readStoredValue(STORAGE_KEYS.auth, null)

const hasRemoteSession = () => Boolean(getAuthIdentity()?.email)

const parseNumber = (value, fallback = 0) => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : fallback
}

const normalizeSize = (value) => ({
  label: value?.label || DEFAULT_SIZE.label,
  note: value?.note || DEFAULT_SIZE.note,
  factor: parseNumber(value?.factor, DEFAULT_SIZE.factor),
})

const normalizeCartItem = (item) => {
  const quantity = Math.max(parseNumber(item?.qty ?? item?.quantity, 1), 1)
  const unitPrice = parseNumber(item?.price ?? item?.unitPrice ?? item?.priceAtTime, 0)
  const imageUrl = item?.imageUrl || item?.image || item?.product_image || FALLBACK_IMAGE

  return {
    id: item?.id,
    productId: item?.productId ?? item?.product_id ?? item?.productId,
    groupSessionId: item?.groupSessionId ?? item?.group_session_id ?? null,
    userId: item?.userId ?? item?.user_id ?? null,
    name: item?.name || item?.product_name || 'Menu',
    category: item?.category || item?.product_category || 'Menu',
    description: item?.description || item?.product_description || '',
    imageUrl,
    image: imageUrl,
    badge: item?.badge || item?.product_badge || '',
    stock: parseNumber(item?.stock ?? item?.product_stock, 0),
    qty: quantity,
    price: unitPrice,
    unitPrice,
    size: normalizeSize(item?.size),
    subtotal: parseNumber(item?.subtotal, unitPrice * quantity),
  }
}

const calculateSummary = (items = []) => {
  const subtotal = items.reduce((sum, item) => sum + parseNumber(item.subtotal, 0), 0)
  const totalItems = items.reduce((sum, item) => sum + parseNumber(item.qty, 0), 0)

  return {
    subtotal,
    totalItems,
    count: totalItems,
  }
}

const buildCartState = (payload = {}) => {
  const items = Array.isArray(payload.items) ? payload.items.map(normalizeCartItem) : []
  const summary = calculateSummary(items)

  return {
    session: payload.session || null,
    items,
    ...summary,
  }
}

const persistLocalCart = (items) => {
  const normalizedItems = Array.isArray(items) ? items.map(normalizeCartItem) : []
  writeStoredValue(STORAGE_KEYS.cart, normalizedItems)
  dispatchCartChange()
  return buildCartState({ items: normalizedItems })
}

const readLocalCart = () => buildCartState({ items: readStoredValue(STORAGE_KEYS.cart, []) })

const remoteRequest = async (method, path = '', data = null, params = null) => {
  const response = await axios({
    method,
    url: `${getCartApiUrl()}${path}`,
    data,
    params,
  })

  return buildCartState(response.data)
}

const syncCartSnapshot = (cartState, { dispatch = true } = {}) => {
  const normalized = buildCartState(cartState)
  writeStoredValue(STORAGE_KEYS.cart, normalized.items)
  if (dispatch) {
    dispatchCartChange()
  }
  return normalized
}

export const fetchCart = async () => {
  if (!hasRemoteSession()) {
    return readLocalCart()
  }

  const auth = getAuthIdentity()

  try {
    const cartState = await remoteRequest('get', '', null, {
      userEmail: auth?.email,
      userName: auth?.name,
    })

    return syncCartSnapshot(cartState, { dispatch: false })
  } catch (error) {
    console.warn('Gagal memuat keranjang dari backend, fallback ke localStorage:', error)
    return readLocalCart()
  }
}

export const addCartItem = async (product, quantity = 1) => {
  const safeQuantity = Math.max(parseNumber(quantity, 1), 1)

  if (!hasRemoteSession()) {
    const currentCart = readLocalCart()
    const existingIndex = currentCart.items.findIndex((item) => String(item.productId) === String(product.id))

    if (existingIndex >= 0) {
      currentCart.items[existingIndex] = {
        ...currentCart.items[existingIndex],
        qty: currentCart.items[existingIndex].qty + safeQuantity,
        subtotal: (currentCart.items[existingIndex].qty + safeQuantity) * currentCart.items[existingIndex].price,
      }
    } else {
      currentCart.items.push(
        normalizeCartItem({
          id: product.id,
          productId: product.id,
          name: product.name,
          category: product.category,
          description: product.description,
          imageUrl: product.image_url || product.image,
          badge: product.badge,
          stock: product.stock,
          price: product.price,
          qty: safeQuantity,
          size: DEFAULT_SIZE,
        })
      )
    }

    return persistLocalCart(currentCart.items)
  }

  const auth = getAuthIdentity()

  try {
    const cartState = await remoteRequest(
      'post',
      '/items',
      {
        userEmail: auth?.email,
        userName: auth?.name,
        productId: product.id,
        quantity: safeQuantity,
      }
    )

    return syncCartSnapshot(cartState)
  } catch (error) {
    console.warn('Gagal menambahkan menu ke backend, fallback ke localStorage:', error)
    const currentCart = readLocalCart()
    const existingIndex = currentCart.items.findIndex((item) => String(item.productId) === String(product.id))
    const nextItems = [...currentCart.items]

    if (existingIndex >= 0) {
      const currentItem = nextItems[existingIndex]
      const nextQty = currentItem.qty + safeQuantity
      nextItems[existingIndex] = {
        ...currentItem,
        qty: nextQty,
        subtotal: currentItem.price * nextQty,
      }
    } else {
      nextItems.push(
        normalizeCartItem({
          ...product,
          id: product.id,
          productId: product.id,
          imageUrl: product.image_url || product.image,
          qty: safeQuantity,
          size: DEFAULT_SIZE,
        })
      )
    }

    return persistLocalCart(nextItems)
  }
}

export const setCartItemQuantity = async (itemId, quantity) => {
  const nextQuantity = Math.max(parseNumber(quantity, 0), 0)

  if (!hasRemoteSession()) {
    const currentCart = readLocalCart()
    const nextItems = currentCart.items
      .map((item) => (String(item.id) === String(itemId) ? { ...item, qty: nextQuantity, subtotal: item.price * nextQuantity } : item))
      .filter((item) => item.qty > 0)

    return persistLocalCart(nextItems)
  }

  const auth = getAuthIdentity()

  try {
    const cartState = await remoteRequest(
      'patch',
      `/items/${itemId}`,
      {
        userEmail: auth?.email,
        userName: auth?.name,
        quantity: nextQuantity,
      }
    )

    return syncCartSnapshot(cartState)
  } catch (error) {
    console.warn('Gagal memperbarui item keranjang dari backend, fallback ke localStorage:', error)
    const currentCart = readLocalCart()
    const nextItems = currentCart.items
      .map((item) => (String(item.id) === String(itemId) ? { ...item, qty: nextQuantity, subtotal: item.price * nextQuantity } : item))
      .filter((item) => item.qty > 0)

    return persistLocalCart(nextItems)
  }
}

export const removeCartItem = async (itemId) => {
  if (!hasRemoteSession()) {
    const currentCart = readLocalCart()
    const nextItems = currentCart.items.filter((item) => String(item.id) !== String(itemId))
    return persistLocalCart(nextItems)
  }

  const auth = getAuthIdentity()

  try {
    const cartState = await remoteRequest(
      'delete',
      `/items/${itemId}`,
      {
        userEmail: auth?.email,
        userName: auth?.name,
      }
    )

    return syncCartSnapshot(cartState)
  } catch (error) {
    console.warn('Gagal menghapus item keranjang dari backend, fallback ke localStorage:', error)
    const currentCart = readLocalCart()
    const nextItems = currentCart.items.filter((item) => String(item.id) !== String(itemId))
    return persistLocalCart(nextItems)
  }
}

export const clearCart = async () => {
  if (!hasRemoteSession()) {
    return persistLocalCart([])
  }

  const auth = getAuthIdentity()

  try {
    const cartState = await remoteRequest('delete', '', null, {
      userEmail: auth?.email,
      userName: auth?.name,
    })

    return syncCartSnapshot(cartState)
  } catch (error) {
    console.warn('Gagal mengosongkan keranjang dari backend, fallback ke localStorage:', error)
    return persistLocalCart([])
  }
}

export const getStoredCart = () => readLocalCart()
