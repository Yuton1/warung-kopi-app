import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
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
    <div className="min-h-screen pb-20">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="flex items-center gap-4 mb-10">
          <button
            className="p-2 bg-white rounded-full shadow-sm text-[#4A3728] hover:bg-[#B08968] hover:text-white transition-all"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-4xl font-black text-[#4A3728] tracking-tighter">
            Keranjang <span className="text-[#6F4E37]">Belanja</span>
          </h1>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#4A3728]">
            Memuat keranjang...
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onUpdateQty={updateQty} 
                  onRemove={removeItem} 
                />
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#4A3728] shadow-sm hover:bg-[#f5ebde]"
              >
                Kosongkan Keranjang
              </button>
            </div>
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                onCheckout={() => navigate('/confirm-pesanan')}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="w-20 h-20 text-[#B08968] opacity-30 mb-4" />
            <h2 className="text-2xl font-black text-[#4A3728]">Keranjangmu kosong</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
