import axios from 'axios'
import { getApiBaseUrl } from '../utils/apiBaseUrl'

const getBaristaOrdersUrl = () => {
  const baseUrl = getApiBaseUrl()
  return baseUrl ? `${baseUrl}/api/orders/barista` : '/api/orders/barista'
}

const normalizeOrder = (order) => ({
  ...order,
  id: order.id,
  statusRaw: Number.isFinite(Number(order.statusRaw))
    ? Number(order.statusRaw)
    : Number.isFinite(Number(order.status))
      ? Number(order.status)
      : order.statusRaw ?? order.status,
  status: order.status || 'Pending',
  customerName: order.customerName || 'Pelanggan',
  groupCode: order.groupCode || '',
  tableNumber: order.tableNumber ?? null,
  pickupNote: order.pickupNote || '',
  items: Array.isArray(order.items)
    ? order.items.map((item) => ({
        ...item,
        qty: Number(item.qty ?? item.quantity ?? 1) || 1,
        size: item.size || 'Normal',
        imageUrl: item.imageUrl || item.image || '/Logo_Warkop_Nav.png',
        subtotal: Number(item.subtotal ?? (Number(item.priceAtTime ?? item.price ?? 0) * (Number(item.qty ?? item.quantity ?? 1) || 1))) || 0,
      }))
    : [],
})

export const fetchBaristaQueue = async () => {
  const response = await axios.get(`${getBaristaOrdersUrl()}/queue`)
  return Array.isArray(response.data) ? response.data.map(normalizeOrder) : []
}

export const updateBaristaOrderStatus = async (orderId, status) => {
  const response = await axios.patch(`${getBaristaOrdersUrl()}/${orderId}/status`, {
    status,
  })

  return Array.isArray(response.data) ? response.data.map(normalizeOrder) : []
}
