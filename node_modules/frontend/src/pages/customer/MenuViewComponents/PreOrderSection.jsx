import React, { useState, useEffect } from 'react';

const PreOrderSection = ({ hasCart, preOrder, onSave, onCancel }) => {
  const [time, setTime] = useState(preOrder?.time || "");
  const [note, setNote] = useState(preOrder?.note || "");

  // Update state lokal jika prop preOrder berubah (misal saat load data)
  useEffect(() => {
    if (preOrder) {
      setTime(preOrder.time || "");
      setNote(preOrder.note || "");
    }
  }, [preOrder]);

  return (
    <article className="feature-preorder-card relative overflow-hidden bg-gradient-to-br from-[#4A3728] via-[#2B1B17] to-[#1A120B] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl transition-all duration-500">
      
      {/* Background Texture / Cahaya (Opsional untuk estetika image_b47d39.jpg) */}
      <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8D6E63] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
        
        {/* --- SISI KIRI: INFORMASI & INPUT --- */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Pre-order</h2>
            <span className="text-orange-400 font-bold text-sm uppercase tracking-widest block mb-4">
              Fitur Pre-order Scheduling
            </span>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Atur jam ambil dan simpan pre-order. Pilih jam ambil, tulis catatan, 
              lalu simpan order agar bisa diubah atau dibatalkan sebelum checkout.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Input Jam */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Jam Ambil</label>
              <input 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold"
              />
            </div>
            {/* Input Catatan */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-[10px] font-black uppercase text-gray-400">Catatan Pengambilan</label>
              <input 
                type="text"
                placeholder="Contoh: Ambil di parkiran depan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* --- SISI KANAN: TOMBOL AKSI --- */}
        <div className="flex flex-col gap-3 w-full lg:w-72">
          <button 
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
              !hasCart 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-[#1A120B] text-white hover:bg-black border border-white/10'
            }`}
            onClick={() => onSave({ time, note })}
            disabled={!hasCart}
          >
            Simpan Pre-order
          </button>
          
          <button 
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
              !preOrder 
              ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-[#1A120B] hover:bg-gray-100 shadow-xl'
            }`}
            onClick={onCancel}
            disabled={!preOrder}
          >
            Batalkan
          </button>

          {!hasCart && (
            <p className="text-[10px] text-center text-orange-300 mt-2 italic">
              * Tambahkan menu ke keranjang untuk mengatur jadwal
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default PreOrderSection;
