import { useState } from 'react';
import { formatRupiah } from '../../../utils/formatRupiah';

const CartFloating = ({
  cart = [],         
  subtotal = 0,     
  tableNumber = "", 
  pickupTime = "",  
  orderNote = "",   
  preOrder = null,
  loyaltyPoints = 0,
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onClearCart = () => {},
  onTableNumberChange = () => {},
  onPickupTimeChange = () => {},
  onOrderNoteChange = () => {},
  onSavePreOrder = () => {},
  onCancelPreOrder = () => {},
  onCheckout = () => {},
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const cartCount = cart.reduce((total, item) => total + (Number(item?.qty) || 0), 0);

  return (
    <>
      {/* --- TOMBOL TRIGGER MOBILE FIXED BOTTOM --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] md:hidden">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full bg-gradient-to-r from-[#4A3728] to-[#2B1B17] text-white py-4 px-6 rounded-2xl font-bold flex justify-between items-center shadow-2xl border border-orange-500/30 active:scale-95 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-black animate-pulse">
              {cartCount}
            </div>
            <span className="text-sm tracking-wide font-medium">Lihat Keranjang</span>
          </div>
          <span className="text-base font-extrabold text-orange-400">{formatRupiah(subtotal)}</span>
        </button>
      </div>

      {/* --- BACKDROP UNTUK MOBILE MODAL --- */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* --- UTAMA: PANEL KERANJANG (Full width desktop / Slide-up sheet mobile) --- */}
      <aside 
        className={`
          fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[2.5rem] bg-gradient-to-b from-[#2B1B17] to-[#1A120B] p-6 text-white shadow-2xl border-t border-white/10 transition-transform duration-500 ease-out
          md:relative md:top-auto md:z-10 md:max-h-none md:w-full md:max-w-none md:flex-none md:rounded-[2.5rem] md:border md:p-8 md:overflow-visible
          ${isOpenMobile ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
        `}
      >
        {/* Notch Indikator Drag untuk Mobile */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden" onClick={() => setIsOpenMobile(false)} />

        {/* --- HEADER --- */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block mb-1">
              Pemesanan Aktif
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">Keranjang & Pre-order</h2>
          </div>
          <button 
            type="button" 
            onClick={onClearCart} 
            disabled={!cart.length}
            className="text-xs font-bold text-gray-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5 active:scale-95"
          >
            Kosongkan
          </button>
        </div>

        {/* --- INPUT FIELDS (Meja & Jam) --- */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Nomor Meja</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 12"
              value={tableNumber}
              onChange={(event) => onTableNumberChange(event.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-600"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Jam Ambil</span>
            <input
              type="time"
              value={pickupTime}
              onChange={(event) => onPickupTimeChange(event.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </label>
        </div>

        {/* --- INPUT CATATAN --- */}
        <label className="flex flex-col gap-1.5 mb-6">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Catatan Pesanan</span>
          <textarea
            rows="2"
            placeholder="Contoh: Less sugar, es pisah..."
            value={orderNote}
            onChange={(event) => onOrderNoteChange(event.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-600 resize-none"
          />
        </label>

        {/* --- RINGKASAN DATA STATS --- */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 mb-6 text-center">
          <div>
            <span className="text-[10px] block font-medium text-gray-400 mb-0.5">Total Item</span>
            <strong className="text-base font-extrabold text-white">{cartCount} Qty</strong>
          </div>
          <div className="border-l border-white/10">
            <span className="text-[10px] block font-medium text-gray-400 mb-0.5">Poin Member</span>
            <strong className="text-base font-extrabold text-orange-400">+{loyaltyPoints} Pts</strong>
          </div>
        </div>

        {/* --- DAFTAR ITEM DI KERANJANG --- */}
        <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 mb-6 scrollbar-thin md:max-h-[260px]">
          {cart.length === 0 ? (
            <div className="text-center py-6 px-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
              <strong className="text-sm font-bold block text-gray-400 mb-1">Keranjang Kosong</strong>
              <p className="text-[11px] text-gray-500 leading-relaxed">Pilih menu di samping untuk mulai memesan.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size?.label || 'normal'}`} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex-1 min-w-0 pr-2">
                  <strong className="text-xs font-bold block truncate text-white">{item.name}</strong>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    {item.size?.label || 'Normal'} • {formatRupiah(item.price ?? item.unitPrice ?? 0)}
                  </span>
                </div>
                
                {/* Kontrol Kuantitas */}
                <div className="flex items-center gap-2.5 bg-black/40 px-2 py-1 rounded-lg border border-white/10 mr-3">
                  <button 
                    type="button" 
                    onClick={() => onUpdateQuantity(item.id, Math.max((Number(item.qty) || 1) - 1, 0))}
                    className="text-xs text-gray-400 hover:text-white font-bold w-4 h-4 flex items-center justify-center transition-colors active:scale-75"
                  >
                    -
                  </button>
                  <span className="text-xs font-black min-w-[14px] text-center">{item.qty}</span>
                  <button 
                    type="button" 
                    onClick={() => onUpdateQuantity(item.id, (Number(item.qty) || 0) + 1)}
                    className="text-xs text-gray-400 hover:text-white font-bold w-4 h-4 flex items-center justify-center transition-colors active:scale-75"
                  >
                    +
                  </button>
                </div>

                <button 
                  type="button" 
                  onClick={() => onRemoveItem(item.id)}
                  className="text-[11px] text-gray-500 hover:text-red-400 font-medium transition-colors opacity-80 group-hover:opacity-100"
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>

        {/* --- SUB-TOTAL & ESTIMASI POIN --- */}
        <div className="border-t border-b border-white/10 py-4 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Subtotal</span>
            <strong className="text-lg font-black text-white">{formatRupiah(subtotal)}</strong>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-gray-400">Potensi Reward Poin</span>
            <span className="font-bold text-orange-400">+{Math.floor(subtotal / 1000)} Pts</span>
          </div>
        </div>

        {/* --- TOMBOL AKSI UTAMA --- */}
        <div className="space-y-2.5 mb-6 md:grid md:grid-cols-3 md:gap-3 md:space-y-0">
          <button 
            type="button" 
            onClick={onCheckout} 
            disabled={!cart.length}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-[#1A120B] disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 font-black py-3.5 rounded-xl text-xs tracking-wider uppercase shadow-lg active:scale-[0.98] transition-all disabled:cursor-not-allowed md:col-span-3"
          >
            ☕ Pesan Sekarang
          </button>

          <button 
            type="button" 
            onClick={onSavePreOrder} 
            disabled={!cart.length}
            className="py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-20 text-[11px] font-bold tracking-wide text-gray-200 active:scale-95 transition-all disabled:cursor-not-allowed"
          >
            Simpan Pre-order
          </button>
          <button 
            type="button" 
            onClick={onCancelPreOrder} 
            disabled={!preOrder}
            className="py-2.5 px-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 disabled:opacity-20 text-[11px] font-bold tracking-wide text-red-400 active:scale-95 transition-all disabled:cursor-not-allowed"
          >
            Batalkan
          </button>
        </div>

        {/* --- KARTU STATUS PRE-ORDER --- */}
        <div className={`p-4 rounded-2xl border transition-all duration-300 ${
          preOrder 
            ? 'bg-gradient-to-br from-[#4A3728]/40 to-[#2B1B17]/40 border-orange-500/30 text-orange-100' 
            : 'bg-black/20 border-white/5 text-gray-500'
        }`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Status Penjadwalan</span>
            <strong className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
              preOrder ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-gray-500'
            }`}>
              {preOrder ? preOrder.status : 'Belum Terjadwal'}
            </strong>
          </div>
          {preOrder ? (
            <div className="space-y-1">
              <p className="text-xs font-medium">
                Diambil jam <span className="font-extrabold text-orange-400">{preOrder.pickupTime}</span> • ({preOrder.items?.length || 0} menu)
              </p>
              <p className="text-[10px] italic text-gray-400 line-clamp-1">
                "{preOrder.note || 'Tidak ada catatan khusus.'}"
              </p>
            </div>
          ) : (
            <p className="text-[11px] leading-relaxed">
              Kamu bisa mengatur *Jam Ambil* di atas terlebih dahulu, kemudian simpan sebagai jadwal *Pre-order*.
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartFloating;
