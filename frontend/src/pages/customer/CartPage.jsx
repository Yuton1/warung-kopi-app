import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import CartItem from './CartPage/CartItem';
import OrderSummary from './CartPage/OrderSummary';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Ice Americano', price: 10000, qty: 2, image: '/Logo_Warkop_Nav.png' },
    { id: 2, name: 'Hot Cafe Latte', price: 15000, qty: 1, image: '/Logo_Warkop_Nav.png' },
  ]);

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="flex items-center gap-4 mb-10">
          <button className="p-2 bg-white rounded-full shadow-sm text-[#4A3728] hover:bg-[#B08968] hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-4xl font- text-[#4A3728] tracking-tighter">
            Keranjang <span className="text-[#6F4E37]">Belanja</span>
          </h1>
        </header>

        {cartItems.length > 0 ? (
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
            </div>
            <div className="lg:col-span-1">
              <OrderSummary subtotal={subtotal} tax={tax} total={total} />
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