import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Store, Utensils, BagShopping, MugHot, Ticket, CreditCard, Receipt } from 'lucide-react'
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
        setErrorMessage('Gagal memuat data keranjang. Coba muat ulang halaman.')
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
    <div className="min-h-screen bg-[#FDF8F4] font-['Fredoka'] pb-20 text-[#241710]">
      {/* Tombol Back & Header Atas */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-16 pt-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#241710] shadow-md hover:bg-[#ff7b00] hover:text-white transition-all duration-300 active:scale-90"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container dengan Skema Warna Gelap Warkop */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-16 mt-6">
        
        {errorMessage && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-bold text-red-600 mb-6 max-w-5xl animate-bounce">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* BUNGKUSAN UTAMA: Blok Cokelat Gelap Besar Sesuai Layout Keranjang Belanja */}
        <div className="bg-[#241710] p-6 sm:p-10 rounded-[3rem] shadow-xl text-white grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative overflow-hidden">
          
          {/* SEKTOR KIRI & TENGAH: Input & Manifest (2/3 Lebar) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Judul di Dalam Blok Cokelat */}
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-6 bg-[#ff7b00] rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FFFBF5]">
                Konfirmasi Pesanan Anda
              </h1>
            </div>

            {/* 1. Tipe Pemesanan Kopi */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-[#FFFBF5]/90">
                <Store className="w-5 h-5 text-[#ff7b00]" /> Pilih Opsi Penyajian
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setOrderType('dine-in')}
                  className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-wider border-2 transition-all duration-300 active:scale-95 ${
                    orderType === 'dine-in'
                      ? 'border-[#ff7b00] bg-[#ff7b00] text-white'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Utensils className="w-4 h-4" /> Makan di Sini
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-wider border-2 transition-all duration-300 active:scale-95 ${
                    orderType === 'takeaway'
                      ? 'border-[#ff7b00] bg-[#ff7b00] text-white'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <BagShopping className="w-4 h-4" /> Bawa Pulang
                </button>
              </div>
            </div>

            {/* 2. List Menu (Menggunakan Desain Pillow Krem Terang khas Warkop) */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-[#FFFBF5]/90">
                <Receipt className="w-5 h-5 text-[#ff7b00]" /> Item Yang Akan Dimasak
              </h2>
              
              {loading ? (
                <div className="rounded-3xl bg-[#FFFBF5] text-[#241710] px-6 py-8 text-center font-bold">
                  Menyelaraskan manifest menu...
                </div>
              ) : cartItems.length > 0 ? (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-[#FFFBF5] text-[#241710] p-4 sm:p-5 rounded-[2rem] flex justify-between items-center shadow-md transition-all duration-300 hover:translate-x-1"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-[#241710] rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-[#241710]/10">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <MugHot className="w-6 h-6 text-white/20" />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] bg-[#ff7b00]/10 text-[#ff7b00] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                            {item.category || 'COFFEE'}
                          </span>
                          <h4 className="font-black text-base sm:text-lg tracking-tight mt-0.5">{item.name}</h4>
                          <p className="text-xs font-bold text-gray-400 mt-0.5">
                            Varian: <span className="text-[#ff7b00]">{item.size?.label || 'Normal'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-xs bg-[#241710] text-white px-2.5 py-0.5 rounded-full font-bold">
                          {item.qty}x
                        </span>
                        <p className="font-black text-base sm:text-lg text-[#241710] mt-1">
                          {formatRupiah((Number(item.price ?? item.unitPrice ?? 0) || 0) * (Number(item.qty) || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] bg-[#FFFBF5] text-[#241710] px-6 py-8 text-center font-bold">
                  Keranjang belanja kosong.
                </div>
              )}
            </div>

            {/* 3. Voucher Promo & Pilihan Metode Pembayaran */}
            <div className="space-y-6 pt-2">
              {/* Input Kode Kupon */}
              <div>
                <h2 className="text-base font-bold mb-3 flex items-center gap-2 text-[#FFFBF5]/90">
                  <Ticket className="w-4 h-4 text-[#ff7b00]" /> Masukkan Kupon Potongan (Opsional)
                </h2>
                <input
                  type="text"
                  placeholder="Contoh: WARKOPBERKAH"
                  className="w-full max-w-md bg-white/5 border border-white/10 font-bold text-sm rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-[#ff7b00] focus:bg-white focus:text-[#241710] outline-none transition-all placeholder:text-white/30"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>

              {/* Radio Group Pembayaran */}
              <div>
                <h2 className="text-base font-bold mb-3 flex items-center gap-2 text-[#FFFBF5]/90">
                  <CreditCard className="w-4 h-4 text-[#ff7b00]" /> Pilih Alur Pembayaran
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Cashier', 'E-Wallet (QRIS)', 'Transfer Bank'].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                        paymentMethod === method 
                          ? 'border-[#ff7b00] bg-[#ff7b00]/10 text-white' 
                          : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="w-4 h-4 accent-[#ff7b00] cursor-pointer"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                      <span className="font-bold text-xs uppercase tracking-wide">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* SEKTOR KANAN: Kotak Billing Summary Berwarna Kontras (1/3 Lebar) */}
          <div className="lg:sticky lg:top-6 bg-[#1a100a] p-6 sm:p-8 rounded-[2.5rem] border border-white/[0.03] space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest border-b border-white/10 pb-3 text-white/50">
              Kalkulasi Nota
            </h3>

            <div className="space-y-3 text-sm font-medium text-white/70">
              <div className="flex justify-between">
                <span>Subtotal Items</span>
                <span className="font-bold text-white">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pajak Resto (10%)</span>
                <span className="font-bold text-white">{formatRupiah(tax)}</span>
              </div>
              
              <div className="border-t border-white/5 my-4 pt-4 flex justify-between items-center">
                <span className="text-base font-bold text-white">Total Tagihan</span>
                <span className="text-[#ffd60a] text-2xl font-black tracking-tight">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            {/* Tombol Pay dengan Animasi Efek Kilat / Shine Taktil */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={submitting || loading || cartItems.length === 0}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[#ff7b00] to-[#ff9500] hover:brightness-110 disabled:from-gray-700 disabled:to-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-3 active:scale-[0.97] border-b-4 border-[#cc6200] disabled:border-transparent active:border-b-0 active:translate-y-[4px] group"
            >
              {/* Efek Kilatan Sinar */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />

              <style>{`
                @keyframes shine {
                  100% { transform: translateX(100%); }
                }
                .animate-shine { animation: shine 0.7s ease-out; }
              `}</style>

              <span className="tracking-wider text-sm">
                {submitting ? 'Memproses...' : 'Buat Pesanan Sekarang'}
              </span>
            </button>

            <p className="text-center text-white/30 text-[11px] font-medium italic mt-2">
              *Ingin bagi tagihan? Aktifkan fitur <b>Split Bill</b> di sesi grup Anda.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ConfirmPesanan