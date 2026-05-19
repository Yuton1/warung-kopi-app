import React from 'react';
import { ChevronDown } from 'lucide-react';

const RiwayatPesanan = ({ history = [] }) => {
  return (
    <div className="w-full mt-6 mb-12">
      {/* Header Section untuk Riwayat */}
      <div className="mb-6 px-2">
        <p className="text-[#ff7b00] text-xs font-bold uppercase tracking-widest opacity-90">
          Kira-kira kamu pesan apa saja ya minggu ini?
        </p>
        <h2 className="text-2xl font-black text-white mt-1">Riwayat Pesanan</h2>
      </div>

      {/* Kontainer List - Dipastikan W-Full */}
      <div className="w-full flex flex-col gap-4">
        {history.length > 0 ? (
          history.map((item) => (
            <div 
              key={item.id} 
              className="w-full bg-[#fffaf0] rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(30,20,15,0.05)] text-[#241710] flex justify-between items-center transition-all duration-200 hover:shadow-[0_8px_25px_rgba(30,20,15,0.1)] border border-black/[0.03] active:scale-[0.99]"
            >
              {/* Sisi Kiri: Gambar dan Info Produk */}
              <div className="flex gap-4 items-center min-w-0">
                {/* Thumbnail Produk */}
                <div className="w-[62px] h-[62px] bg-[#1e140f] rounded-2xl overflow-hidden flex-none shadow-md border border-black/10">
                  <img 
                    src={item.imageUrl || item.image || "/Logo_Warkop_Nav.png"} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </div>
                
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#ff7b00]">
                    {item.category || 'COFFEE'}
                  </p>
                  <h3 className="text-lg font-black tracking-tight truncate text-[#241710] leading-tight mt-0.5">
                    {item.name}
                  </h3>
                  {/* Badge Status Selesai / Completed */}
                  <span className="inline-flex bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full mt-1.5 shadow-sm">
                    {item.statusLabel || item.status || 'COMPLETED'}
                  </span>
                </div>
              </div>

              {/* Sisi Kanan: Jumlah, Harga, dan Icon */}
              <div className="flex items-center gap-4 flex-none ml-4">
                <div className="text-right flex flex-col items-end gap-1">
                  {/* Badge Jumlah Item */}
                  <div className="bg-[#241710] text-[#fffaf0] px-3 py-0.5 rounded-lg font-black text-xs text-center shadow-sm min-w-[45px]">
                    {item.quantity}x
                  </div>
                  {/* Harga dengan format Rupiah */}
                  <p className="text-lg font-black tracking-tight text-[#241710]">
                    Rp {(item.price || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                
                {/* Icon dropdown */}
                <ChevronDown className="w-5 h-5 text-[#241710]/40" />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-sm">
            <p className="text-base font-black text-white">Riwayat Masih Kosong</p>
            <p className="mt-1 text-xs text-white/50">Belum ada transaksi lama yang tercatat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiwayatPesanan;
