import React, { useState } from 'react';

const GroupOrderSection = ({ groupOrder, hasCart, onUpdateMembers, onAddCart, onConfirm }) => {
  const hasActiveSession = Boolean(groupOrder?.id && groupOrder?.code);
  const groupCode = hasActiveSession ? groupOrder.code : 'Belum ada sesi aktif';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!hasActiveSession) return;
    navigator.clipboard.writeText(groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset status animasi tombol salin
  };

  return (
    <article className="relative overflow-hidden bg-white rounded-[2.5rem] p-6 md:p-10 shadow-lg border border-orange-100/40 transition-all duration-300 hover:shadow-xl font-['Fredoka'] text-[#4A3728]">
      {/* Decorative Background Blob untuk nuansa kafe */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FDF7F2] rounded-full blur-2xl opacity-70 pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-stretch gap-8">
        
        {/* INFO & INPUT KIRI */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                hasActiveSession
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-amber-700 bg-amber-50'
              }`}>
                {hasActiveSession ? 'Sesi Grup Aktif' : 'Sesi Belum Aktif'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1A120B] tracking-tight">
              Group Order & Split Bill
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">
              Gabung pesanan bareng teman, bagi tagihan otomatis per kepala.
            </p>
          </div>

          {/* Form Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            {/* Input Jumlah Anggota */}
            <div className="flex flex-col gap-1.5 bg-[#FDF7F2] p-3 rounded-2xl border border-orange-100/60 hover:border-orange-200 transition-all">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-users text-[#FF6E00]"></i> Jumlah Anggota
              </label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  min="1" 
                  value={groupOrder.members || 1} 
                  onChange={(e) => onUpdateMembers(parseInt(e.target.value) || 1)}
                  className="w-full bg-transparent border-none p-0 text-xl font-bold text-[#1A120B] focus:ring-0 outline-none"
                />
                <span className="text-sm font-bold text-gray-400 ml-2">Orang</span>
              </div>
            </div>

            {/* Input Tampilan Kode Grup */}
            <div className="flex flex-col gap-1.5 bg-[#FDF7F2] p-3 rounded-2xl border border-transparent">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-key text-[#FF6E00]"></i> Kode Undangan
              </label>
              <div className="flex items-center justify-between">
                <span className="text-lg font-mono font-black text-[#4A3728] tracking-widest">
                  {groupCode}
                </span>
                <div className="w-2 h-2 rounded-full bg-orange-300 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Tombol Salin Undangan */}
          <div className="pt-2">
            <button 
              onClick={handleCopy}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all duration-300 active:scale-95 flex items-center gap-2 ${
                !hasActiveSession
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : copied 
                  ? 'bg-emerald-600 text-white shadow-emerald-100' 
                  : 'bg-[#1A120B] text-white hover:bg-black'
              }`}
              disabled={!hasActiveSession}
              type="button"
            >
              <i className={`fa-solid ${copied ? 'fa-circle-check animate-bounce' : 'fa-share-nodes'}`}></i>
              {hasActiveSession ? (copied ? 'Tersalin ke Clipboard!' : 'Bagikan Link / Kode Grup') : 'Belum Ada Sesi'}
            </button>
          </div>
        </div>

        {/* SEPARATOR LINE (Desktop Only) */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent self-stretch mx-2" />

        {/* ACTIONS KANAN */}
        <div className="flex flex-col justify-center gap-3 w-full lg:w-80">
          <div className="bg-[#FDF7F2] p-4 rounded-2xl border border-dashed border-orange-200 mb-2 text-center">
            <p className="text-xs font-semibold text-gray-500">
              Isi keranjang pribadimu otomatis digabungkan ke data <span className="font-bold text-[#4A3728]">group_cart_items</span>.
            </p>
          </div>

          {/* Button 1: Tambah ke Keranjang Grup */}
          <button 
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm active:scale-[0.97] flex items-center justify-center gap-3 border-b-4 ${
              !hasCart || !hasActiveSession
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'bg-[#FF6E00] text-white hover:brightness-110 border-orange-700 active:border-b-0 active:translate-y-[4px]'
            }`}
            onClick={onAddCart}
            disabled={!hasCart || !hasActiveSession}
            type="button"
          >
            <i className="fa-solid fa-cart-plus"></i>
            <span>Tambah ke Keranjang Grup</span>
          </button>
          
          {/* Button 2: Konfirmasi Pembayaran */}
          <button 
            className={`w-full py-4 bg-white border-2 rounded-2xl font-bold text-sm shadow-sm transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-3 group ${
              hasActiveSession
                ? 'border-gray-200 hover:border-[#1A120B] hover:bg-gray-50 text-[#1A120B]'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            onClick={onConfirm}
            disabled={!hasActiveSession}
            type="button"
          >
            <i className="fa-solid fa-file-invoice-dollar text-[#FF6E00] group-hover:animate-pulse"></i>
            <span>Konfirmasi Pembayaran Grup</span>
          </button>
        </div>

      </div>
    </article>
  );
};

export default GroupOrderSection;
