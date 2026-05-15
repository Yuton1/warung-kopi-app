import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatRupiah } from '../../utils/formatRupiah'
import { createCheckoutOrder, fetchCart } from '../../services/cartService'

const ConfirmPesanan = () => {
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState('dine-in')
  const [paymentMethod, setPaymentMethod] = useState('Cashier')
  const [promoCode, setPromoCode] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true)
        setErrorMessage('')
        const snapshot = await fetchCart()
        setCartItems(snapshot.items || [])
      } catch (error) {
        console.error('Gagal memuat cart untuk checkout:', error)
        setErrorMessage('Gagal memuat data keranjang. Coba login ulang atau muat ulang halaman.')
      } finally {
        setLoading(false)
      }
    }

    loadCart()

    const handleCartChange = () => loadCart()
    window.addEventListener('warungkopi-state-changed', handleCartChange)
    window.addEventListener('storage', handleCartChange)

    return () => {
      window.removeEventListener('warungkopi-state-changed', handleCartChange)
      window.removeEventListener('storage', handleCartChange)
    }
  }, [])

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + (Number(item.subtotal) || Number(item.price ?? item.unitPrice ?? 0) * (Number(item.qty) || 0)),
        0
      ),
    [cartItems]
  )

  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleCheckout = async () => {
    try {
      setSubmitting(true)
      setErrorMessage('')

      const result = await createCheckoutOrder({
        orderType,
        paymentMethod,
        promoCode,
      })

      window.dispatchEvent(new Event('warungkopi-state-changed'))
      navigate('/pesanan', {
        replace: true,
        state: {
          message: `Pesanan berhasil dibuat. Total ${formatRupiah(result.order?.totalAmount ?? total)}.`,
        },
      })
    } catch (error) {
      console.error('Checkout gagal:', error)
      setErrorMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Gagal membuat pesanan.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF7F2] font-['Fredoka'] pb-10 text-[#4A3728]">
      <div className="bg-white p-8 rounded-b-[3rem] shadow-sm flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-[#FDF7F2] flex items-center justify-center text-xl hover:bg-gray-100 transition-all"
          type="button"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h1 className="text-3xl font-bold">Konfirmasi Pesanan</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-8 space-y-6">
        {errorMessage ? (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <section className="bg-white p-6 rounded-[2rem] shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-store text-[#FF6E00]"></i> Tipe Pesanan
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOrderType('dine-in')}
              className={`py-4 rounded-2xl font-semibold border-2 transition-all ${
                orderType === 'dine-in'
                  ? 'border-[#FF6E00] bg-orange-50 text-[#FF6E00]'
                  : 'border-gray-100 text-gray-400'
              }`}
            >
              <i className="fa-solid fa-utensils mr-2"></i> Makan di Sini
            </button>
            <button
              type="button"
              onClick={() => setOrderType('takeaway')}
              className={`py-4 rounded-2xl font-semibold border-2 transition-all ${
                orderType === 'takeaway'
                  ? 'border-[#FF6E00] bg-orange-50 text-[#FF6E00]'
                  : 'border-gray-100 text-gray-400'
              }`}
            >
              <i className="fa-solid fa-bag-shopping mr-2"></i> Bawa Pulang
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-[2rem] shadow-sm">
          <h2 className="text-xl font-bold mb-4">Item Pesanan</h2>
          {loading ? (
            <div className="rounded-2xl bg-[#FDF7F2] px-4 py-5 text-sm text-gray-500">
              Memuat item keranjang...
            </div>
          ) : cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-[#4A3728] rounded-2xl flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <i className="fa-solid fa-mug-hot text-white/30 text-2xl"></i>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-400">
                        {item.size?.label || 'Normal'} x {item.qty}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">
                    {formatRupiah((Number(item.price ?? item.unitPrice ?? 0) || 0) * (Number(item.qty) || 0))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#FDF7F2] px-4 py-5 text-sm text-gray-500">
              Keranjang masih kosong. Tambahkan menu dulu sebelum checkout.
            </div>
          )}
        </section>

        <section className="bg-white p-6 rounded-[2rem] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <i className="fa-solid fa-ticket text-[#FF6E00]"></i> Gunakan Promo
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Masukkan kode promo..."
                className="flex-1 bg-[#FDF7F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF6E00] outline-none"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>
          </div>

          <hr className="border-gray-50" />

          <div>
            <h2 className="text-lg font-bold mb-3">Metode Pembayaran</h2>
            <div className="space-y-3">
              {['Cashier', 'E-Wallet (QRIS)', 'Transfer Bank'].map((method) => (
                <label
                  key={method}
                  className="flex items-center justify-between p-4 bg-[#FDF7F2] rounded-xl cursor-pointer hover:bg-orange-50 transition-all border border-transparent has-[:checked]:border-[#FF6E00]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-orange-200 flex items-center justify-center">
                      <input
                        type="radio"
                        name="payment"
                        className="w-3 h-3 appearance-none checked:bg-[#FF6E00] rounded-full transition-all"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                    </div>
                    <span className="font-semibold">{method}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-300 text-sm"></i>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#4A3728] p-8 rounded-[2.5rem] text-white shadow-2xl">
          <div className="space-y-3 mb-8 text-white/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-white">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak & Layanan (10%)</span>
              <span className="font-bold text-white">{formatRupiah(tax)}</span>
            </div>
            <hr className="border-white/10 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-white">Total Bayar</span>
              <span className="text-3xl font-bold text-[#FF6E00]">{formatRupiah(total)}</span>
            </div>
          </div>

          <button
            className="w-full bg-[#FF6E00] py-5 rounded-2xl font-bold text-xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleCheckout}
            disabled={submitting || loading || cartItems.length === 0}
            type="button"
          >
            <i className="fa-solid fa-receipt"></i>
            {submitting ? 'Memproses...' : 'Buat Pesanan Sekarang'}
          </button>

          <p className="text-center mt-4 text-white/40 text-sm italic">
            *Ingin bagi tagihan? Aktifkan fitur <b>Split Bill</b> di sesi grup Anda.
          </p>
        </section>
      </div>
    </div>
  )
}

export default ConfirmPesanan
