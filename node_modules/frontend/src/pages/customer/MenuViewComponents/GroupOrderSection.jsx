import React from 'react';

const GroupOrderSection = ({ groupOrder, hasCart, onUpdateMembers, onAddCart, onConfirm }) => {
  const groupCode = groupOrder?.code || "GRP-D64J";

  const handleCopy = () => {
    navigator.clipboard.writeText(groupCode);
    alert("Kode grup disalin!");
  };

  return (
    <article className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 transition-all duration-500">
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-8">
        
        {/* INFO & INPUT */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1A120B] mb-1">Group Order & Split Payment</h2>
            <p className="text-[#4A3728] font-bold">Gabung pesanan bareng teman</p>
            <p className="text-gray-500 text-sm max-w-md mt-2">
              Tambahkan isi keranjang ke grup, bagikan kode undangan, dan bagi tagihan per orang.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Anggota</span>
              <input 
                type="number" 
                min="1" 
                value={groupOrder.members} 
                onChange={(e) => onUpdateMembers(parseInt(e.target.value))}
                className="w-24 bg-orange-50/50 border-2 border-orange-100 rounded-2xl px-4 py-3 text-[#1A120B] font-bold focus:outline-none focus:border-orange-400 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Kode Grup</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={groupCode} 
                  readOnly 
                  className="w-40 bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 text-gray-500 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleCopy}
            className="bg-[#1A120B] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-black transition-all active:scale-95"
          >
            Salin Undangan
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 w-full lg:w-72 lg:mt-16">
          <button 
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 ${
              !hasCart 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-[#1A120B] text-white hover:shadow-xl'
            }`}
            onClick={onAddCart}
            disabled={!hasCart}
          >
            Tambah ke Keranjang Grup
          </button>
          
          <button 
            className="w-full py-4 bg-white border-2 border-gray-100 text-[#1A120B] rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all active:scale-95"
            onClick={onConfirm}
          >
            Konfirmasi Pembayaran Grup
          </button>
        </div>
      </div>
    </article>
  );
};

export default GroupOrderSection;