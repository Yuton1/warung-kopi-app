import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatRupiah } from '../../utils/formatRupiah'
import { createCheckoutOrder, fetchCart } from '../../services/cartService'
import { STORAGE_KEYS, readStoredValue, writeStoredValue } from '../../data/customerStorage'

const ConfirmPesanan = () => {
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState('dine-in')
  const [paymentMethod, setPaymentMethod] = useState('Cashier')
  const [promoCode, setPromoCode] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [preOrder, setPreOrder] = useState(() => readStoredValue(STORAGE_KEYS.preorder, null))
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

    const syncPreOrder = () => {
      setPreOrder(readStoredValue(STORAGE_KEYS.preorder, null))
    }

    const handleCartChange = () => loadCart()
    window.addEventListener('warungkopi-state-changed', handleCartChange)
    window.addEventListener('storage', handleCartChange)
    window.addEventListener('warungkopi-state-changed', syncPreOrder)
    window.addEventListener('storage', syncPreOrder)

    return () => {
      window.removeEventListener('warungkopi-state-changed', handleCartChange)
      window.removeEventListener('storage', handleCartChange)
      window.removeEventListener('warungkopi-state-changed', syncPreOrder)
      window.removeEventListener('storage', syncPreOrder)
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
        pickupTime: preOrder?.pickupTime || preOrder?.time || '',
        pickupNote: preOrder?.note || '',
        isPreorder: Boolean(preOrder),
      })

      writeStoredValue(STORAGE_KEYS.preorder, null)
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
    <div className="min-h-screen bg-[#FDF7F2] font-['Fredoka'] pb-16 text-[#4A3728]">
      {/* Navbar Atas / Header */}
      <div className="flex items-center gap-4 md:gap-6 transition-all duration-300">
       <button
         onClick={() => navigate(-1)}
         className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FDF7F2] flex items-center justify-center text-sm md:text-xl text-[#4A3728] hover:bg-[#FF6E00] hover:text-white transition-all duration-300 active:scale-90 shadow-sm"
         type="button"
       >
         {/* Menggunakan SVG inline agar panah pasti muncul & warna mengikuti hover text-white */}
         <svg 
           xmlns="http://www.w3.org/2000/svg" 
           fill="none" 
           viewBox="0 0 24 24" 
           strokeWidth="3" 
           stroke="currentColor" 
           className="w-5 h-5 md:w-6 md:h-6"
         >
           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
         </svg>
       </button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Konfirmasi Pesanan</h1>
      </div>

      {/* Main Container dengan Responsif Grid (2 Kolom Kiri-Kanan seperti halaman Keranjang Belanja) */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mt-6 md:mt-8">
        
        {errorMessage ? (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 mb-6 animate-fade-in">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* KOLOM KIRI (Lebar 2/3): Form Pilihan & Item Menu */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Tipe Pesanan */}
            <section className="bg-white p-5 md:p-6 rounded-[2rem] shadow-sm transition-all duration-300 hover:shadow-md">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-store text-[#FF6E00]"></i> Tipe Pesanan
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setOrderType('dine-in')}
                  className={`py-3.5 md:py-4 rounded-2xl font-semibold border-2 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2 ${
                    orderType === 'dine-in'
                      ? 'border-[#FF6E00] bg-orange-50 text-[#FF6E00] shadow-sm'
                      : 'border-gray-100 text-gray-400 bg-white hover:bg-gray-50'
                  }`}
                >
                  <i className="fa-solid fa-utensils"></i> Makan di Sini
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`py-3.5 md:py-4 rounded-2xl font-semibold border-2 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2 ${
                    orderType === 'takeaway'
                      ? 'border-[#FF6E00] bg-orange-50 text-[#FF6E00] shadow-sm'
                      : 'border-gray-100 text-gray-400 bg-white hover:bg-gray-50'
                  }`}
                >
                  <i className="fa-solid fa-bag-shopping"></i> Bawa Pulang
                </button>
              </div>
            </section>

            {/* 2. Item Pesanan (Pillow Shape Container) */}
            <section className="bg-white p-5 md:p-6 rounded-[2rem] shadow-sm transition-all duration-300 hover:shadow-md">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-mug-hot text-[#FF6E00]"></i> Item Pesanan
              </h2>
              {loading ? (
                <div className="rounded-2xl bg-[#FDF7F2] px-4 py-5 text-sm text-gray-500 animate-pulse">
                  Memuat item keranjang...
                </div>
              ) : cartItems.length > 0 ? (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center bg-[#FDF7F2] p-4 rounded-[1.5rem] border border-transparent hover:border-orange-100 hover:translate-x-1 transition-all duration-300"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-[#4A3728] rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <i className="fa-solid fa-mug-hot text-white/30 text-xl md:text-2xl"></i>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-base md:text-lg text-[#4A3728] leading-tight">{item.name}</h4>
                          <p className="text-xs md:text-sm text-gray-400 mt-1">
                            Varian: <span className="text-[#FF6E00] font-semibold">{item.size?.label || 'Normal'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-xs bg-[#4A3728] text-white px-2 py-0.5 rounded-full font-bold">
                          {item.qty}x
                        </span>
                        <p className="font-bold text-base md:text-lg text-[#4A3728]">
                          {formatRupiah((Number(item.price ?? item.unitPrice ?? 0) || 0) * (Number(item.qty) || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#FDF7F2] px-4 py-5 text-sm text-gray-500 text-center">
                  Keranjang masih kosong. Tambahkan menu dulu sebelum checkout.
                </div>
              )}
            </section>

            {/* 3. Promo & Pembayaran */}
            <section className="bg-white p-5 md:p-6 rounded-[2rem] shadow-sm space-y-6 transition-all duration-300 hover:shadow-md">
              {preOrder ? (
                <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-[#4A3728]">
                  <strong className="block text-xs uppercase tracking-widest text-[#FF6E00] mb-1">
                    Pre-order aktif
                  </strong>
                  Ambil pukul <strong>{preOrder.pickupTime || preOrder.time}</strong>
                  {preOrder.note ? ` • ${preOrder.note}` : ''}
                </div>
              ) : null}

              <div>
                <h2 className="text-base md:text-lg font-bold mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-ticket text-[#FF6E00]"></i> Gunakan Promo
                </h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Masukkan kode promo..."
                    className="flex-1 bg-[#FDF7F2] border-2 border-transparent rounded-xl px-4 py-3 focus:ring-0 focus:border-[#FF6E00] focus:bg-white transition-all outline-none font-medium text-sm"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <h2 className="text-base md:text-lg font-bold mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-credit-card text-[#FF6E00]"></i> Metode Pembayaran
                </h2>
              <div className="space-y-2.5">
                  {['Cashier', 'E-Wallet (QRIS)', 'Transfer Bank'].map((method) => (
                    <label
                      key={method}
                      className="flex items-center justify-between p-4 bg-[#FDF7F2] rounded-xl cursor-pointer hover:bg-orange-50/60 transition-all duration-200 border border-transparent has-[:checked]:border-[#FF6E00] has-[:checked]:bg-white group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-orange-200 flex items-center justify-center transition-all group-hover:border-[#FF6E00]">
                          <input
                            type="radio"
                            name="payment"
                            className="w-2.5 h-2.5 appearance-none checked:bg-[#FF6E00] rounded-full transition-all cursor-pointer"
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                      />
                        </div>
                        <span className="font-semibold text-sm md:text-base text-[#4A3728]">{method}</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-gray-300 text-xs transition-transform group-hover:translate-x-1"></i>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* KOLOM KANAN (Lebar 1/3): Nota Ringkasan Belanja Sticky */}
          <div className="lg:sticky lg:top-6">
            <section className="bg-[#4A3728] p-6 md:p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="space-y-3.5 mb-6 text-white/80 text-sm md:text-base">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/10 pb-2 mb-4">
                  Ringkasan Nota
                </h3>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak & Layanan (10%)</span>
                  <span className="font-bold text-white">{formatRupiah(tax)}</span>
                </div>
                <hr className="border-white/10 my-4" />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-lg md:text-xl font-bold text-white">Total Bayar</span>
                  <span className="text-2xl md:text-3xl font-black text-[#FF6E00] drop-shadow-sm">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-[#FF6E00] py-4 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:brightness-110 active:scale-[0.96] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-orange-800 active:border-b-0 active:translate-y-[4px] relative overflow-hidden group"
                onClick={handleCheckout}
                disabled={submitting || loading || cartItems.length === 0}
                type="button"
              >
                {/* Efek Kilatan Hover Animasi */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
                
                <i className="fa-solid fa-receipt"></i>
                <span>{submitting ? 'Memproses...' : 'Buat Pesanan Sekarang'}</span>
              </button>

              <p className="text-center mt-4 text-white/40 text-xs italic">
                *Ingin bagi tagihan? Aktifkan fitur <b>Split Bill</b> di sesi grup Anda.
              </p>
            </section>
          </div>

        </div>
      </div>

      {/* Inject Style Animasi Tanpa Merusak File CSS Luar */}
      <style>{`
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        .animate-shine { animation: shine 0.6s ease-out; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default ConfirmPesanan
