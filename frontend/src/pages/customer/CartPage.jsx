import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartPage/CartItem';
import OrderSummary from './CartPage/OrderSummary';
import { clearCart, fetchCart, getStoredCart, removeCartItem, setCartItemQuantity } from '../../services/cartService';

const CartPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(() => getStoredCart().items || [])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const syncCart = async () => {
      try {
        setLoading(true)
        const snapshot = await fetchCart()
        setCartItems(snapshot.items || [])
      } catch (error) {
        console.error('Gagal memuat keranjang:', error)
      } finally {
        setLoading(false)
      }
    }

    syncCart()

    const handleCartChange = () => {
      syncCart()
    }

    window.addEventListener('storage', handleCartChange)
    window.addEventListener('warungkopi-state-changed', handleCartChange)

    return () => {
      window.removeEventListener('storage', handleCartChange)
      window.removeEventListener('warungkopi-state-changed', handleCartChange)
    }
  }, [])

  const updateQty = async (id, delta) => {
    const currentItem = cartItems.find((item) => String(item.id) === String(id))
    if (!currentItem) return

    try {
      const snapshot = await setCartItemQuantity(id, Math.max((Number(currentItem.qty) || 0) + delta, 0))
      setCartItems(snapshot.items || [])
    } catch (error) {
      console.error('Gagal memperbarui jumlah item:', error)
    }
  };

  const removeItem = async (id) => {
    try {
      const snapshot = await removeCartItem(id)
      setCartItems(snapshot.items || [])
    } catch (error) {
      console.error('Gagal menghapus item:', error)
    }
  };

  const clearAll = async () => {
    try {
      const snapshot = await clearCart()
      setCartItems(snapshot.items || [])
    } catch (error) {
      console.error('Gagal mengosongkan keranjang:', error)
    }
  }

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + (Number(item.price ?? item.unitPrice ?? 0) * (Number(item.qty) || 0)),
        0
      ),
    [cartItems]
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen pb-24 bg-[#faf7f2]/40">
      <main className="w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 py-8 sm:py-12 animate-fadeIn">
        
        {/* Header Section */}
        <header className="flex items-center gap-4 mb-10 border-b border-[#241710]/5 pb-6">
          <button
            className="p-3 bg-[#241710]/5 hover:bg-[#241710] rounded-full text-[#241710] hover:text-[#fffaf0] transition-all duration-300 active:scale-90 shadow-sm"
            onClick={() => navigate(-1)}
            type="button"
            title="Kembali ke menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#241710] tracking-tighter">
              Keranjang Belanja
            </h1>
            <p className="text-xs text-[#241710]/50 font-bold uppercase tracking-wider mt-0.5">
              Kelola item pilihanmu sebelum melakukan checkout
            </p>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#241710]">
            <div className="w-10 h-10 border-4 border-[#ff7b00] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-bold text-sm tracking-wide uppercase opacity-70">Memuat data keranjang...</p>
          </div>
        ) : cartItems.length > 0 ? (
          
          /* ✅ DISTRIBUSI LAYOUT BARU: Menggunakan lg:grid-cols-4 */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* List Cart Items (Melar Mendominasi Layar - 3/4 Bagian) */}
            <div className="lg:col-span-3 space-y-4 w-full">
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onUpdateQty={updateQty} 
                  onRemove={removeItem} 
                />
              ))}
              
              {/* Tombol Clear All dengan gaya lebih minimalis nan tegas */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 hover:bg-rose-100 px-5 py-3 text-xs font-black text-rose-600 uppercase tracking-widest shadow-sm active:scale-95 transition-all duration-200 border border-rose-200/40"
                >
                  <Trash2 className="w-4 h-4" />
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
            
            {/* Order Summary Sticky Card (Tetap Pas & Rapi - 1/4 Bagian) */}
            <div className="lg:col-span-1 w-full lg:sticky lg:top-6">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                onCheckout={() => navigate('/confirm-pesanan')}
              />
            </div>

          </div>
        ) : (
          /* Tampilan State Kosong yang Dibuat Lebih Berestetika */
          <div className="flex flex-col items-center justify-center py-24 rounded-[3rem] border-2 border-dashed border-[#241710]/10 bg-[#241710]/[0.01] backdrop-blur-[2px]">
            <div className="w-24 h-24 bg-[#241710]/5 flex items-center justify-center rounded-full mb-4 shadow-inner">
              <ShoppingBag className="w-10 h-10 text-[#241710]/30" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#241710] tracking-tight">Keranjangmu Masih Kosong</h2>
            <p className="mt-1 text-xs text-[#241710]/50 font-bold uppercase tracking-wider">Ayo isi dengan kopi favoritmu!</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-6 bg-[#241710] text-[#fffaf0] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#ff7b00] active:scale-95 transition-all duration-300 shadow-md"
            >
              Lihat Menu Warkop
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;