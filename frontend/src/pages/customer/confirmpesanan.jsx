import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../utils/formatRupiah';

const ConfirmPesanan = () => {
  const navigate = useNavigate();
  
  // State untuk pilihan tipe pesanan & metode pembayaran
  const [orderType, setOrderType] = useState('dine-in'); // dine-in atau takeaway
  const [paymentMethod, setPaymentMethod] = useState('ewallet');
  const [promoCode, setPromoCode] = useState('');

  // Dummy Data (Nanti ini di-fetch dari tabel group_cart_items di TiDB)
  const cartItems = [
    { id: 1, name: 'Kopi Hitam Racik', size: 'Normal', quantity: 2, price: 15000, image_url: '' },
    { id: 2, name: 'Kopi Kapal Api', size: 'Besar', quantity: 1, price: 5000, image_url: '' }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // Pajak 10%
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#FDF7F2] font-['Fredoka'] pb-10 text-[#4A3728]">
      {/* --- HEADER --- */}
      <div className="bg-white p-8 rounded-b-[3rem] shadow-sm flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-[#FDF7F2] flex items-center justify-center text-xl hover:bg-gray-100 transition-all"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h1 className="text-3xl font-bold">Konfirmasi Pesanan</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-8 space-y-6">
        
        {/* --- 1. TIPE PESANAN (Dine-in / Takeaway) --- */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-store text-[#FF6E00]"></i> Tipe Pesanan
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setOrderType('dine-in')}
              className={`py-4 rounded-2xl font-semibold border-2 transition-all ${orderType === 'dine-in' ? 'border-[#FF6E00] bg-orange-50 text-[#FF6E00]' : 'border-gray-100 text-gray-400'}`}
            >
              <i className="fa-solid fa-utensils mr-2"></i> Makan di Sini
            </button>
            <button 
              onClick={() => setOrderType('takeaway')}
              className={`py-4 rounded-2xl font-semibold border-2 transition-all ${orderType === 'takeaway' ? 'border-[#FF6E00] bg-orange-50 text-[#FF6E00]' : 'border-gray-100 text-gray-400'}`}
            >
              <i className="fa-solid fa-bag-shopping mr-2"></i> Bawa Pulang
            </button>
          </div>
        </section>

        {/* --- 2. RINGKASAN ITEM (Dari group_cart_items) --- */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm">
          <h2 className="text-xl font-bold mb-4">Item Pesanan</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-[#4A3728] rounded-2xl flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-mug-hot text-white/30 text-2xl"></i>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-sm text-gray-400">{item.size} x {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-lg">{formatRupiah(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- 3. PROMO & PEMBAYARAN --- */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm space-y-6">
          {/* Input Promo */}
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
              <button className="bg-[#4A3728] text-white px-6 py-3 rounded-xl font-bold hover:brightness-125 transition-all">
                Pakai
              </button>
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* Metode Pembayaran */}
          <div>
            <h2 className="text-lg font-bold mb-3">Metode Pembayaran</h2>
            <div className="space-y-3">
              {['Cashier', 'E-Wallet (QRIS)', 'Transfer Bank'].map((method) => (
                <label key={method} className="flex items-center justify-between p-4 bg-[#FDF7F2] rounded-xl cursor-pointer hover:bg-orange-50 transition-all border border-transparent has-[:checked]:border-[#FF6E00]">
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

        {/* --- 4. RINCIAN BIAYA & BUTTON --- */}
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
            className="w-full bg-[#FF6E00] py-5 rounded-2xl font-bold text-xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
            onClick={() => alert('Pesanan diproses ke tabel orders!')}
          >
            <i className="fa-solid fa-receipt"></i>
            Buat Pesanan Sekarang
          </button>
          
          {/* Fitur Split Bill Sesuai Database */}
          <p className="text-center mt-4 text-white/40 text-sm italic">
            *Ingin bagi tagihan? Aktifkan fitur <b>Split Bill</b> di sesi grup Anda.
          </p>
        </section>

      </div>
    </div>
  );
};

export default ConfirmPesanan;