import React, { useState } from 'react';

const GroupOrderSection = ({ groupOrder, hasCart, onUpdateMembers, onAddCart, onConfirm }) => {
  const [groupCode] = useState(groupOrder?.code || "GRP-D64J");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(groupCode);
    alert("Kode grup berhasil disalin!");
  };

  return (
    <article className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 transition-all duration-500">
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-10">
        
        {/* --- SISI KIRI: HEADER --- */}
        <div className="flex-1">
          <h2 className="text-4xl font-extrabold text-[#1A120B] tracking-tight mb-2">
            Group Order & Split Payment
          </h2>
          <p className="text-[#1A120B] font-bold text-lg mb-1">Gabung pesanan bareng teman</p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md">
            Tambahkan semua isi keranjang ke grup, bagikan kode undangan, dan bagi tagihan per orang secara otomatis.
          </p>

          {/* INPUT AREA */}
          <div className="flex flex-wrap gap-6 mt-10">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400 ml-1">Anggota</label>
              <input 
                type="number"
                min="1"
                value={groupOrder?.members || 1}
                onChange={(e) => onUpdateMembers(parseInt(e.target.value))}
                className="w-32 bg-white border-2 border-orange-100 rounded-2xl px-4 py-3 text-[#1A120B] font-bold focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400 ml-1">Kode Grup</label>
              <input 
                type="text"
                readOnly
                value={groupCode}
                className="w-48 bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 text-gray-500 font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          <button 
            onClick={handleCopyCode}
            className="mt-6 bg-[#1A120B] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg hover:bg-black transition-all active:scale-95 flex items-center gap-2"
          >
            Salin Undangan
          </button>
        </div>

        {/* --- SISI KANAN: ACTIONS --- */}
        <div className="flex flex-col gap-4 w-full lg:w-80 lg:mt-20">
          <button 
            disabled={!hasCart}
            onClick={onAddCart}
            className={`w-full py-5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 ${
              !hasCart 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-[#1A120B] text-white hover:shadow-xl'
            }`}
          >
            Tambah ke Keranjang Grup
          </button>
          
          <button 
            onClick={onConfirm}
            className="w-full py-5 bg-white border-2 border-gray-100 text-[#1A120B] rounded-2xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-95"
          >
            Konfirmasi Pembayaran Grup
          </button>

          {!hasCart && (
            <p className="text-[11px] text-center text-gray-400 mt-2 italic">
              * Isi keranjangmu dulu sebelum menggabungkan pesanan
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default GroupOrderSection;