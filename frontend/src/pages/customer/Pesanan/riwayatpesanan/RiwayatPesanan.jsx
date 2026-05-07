import React from 'react';
import { ChevronDown } from 'lucide-react';

const RiwayatPesanan = ({ history }) => {
  return (
    <div className="mt-12 mb-24">
      {/* Header Section untuk Riwayat */}
      <div className="mb-6">
        <p className="text-[#6F4E37] text-xs font-medium opacity-80">
          Kira kira kamu pesan apa saja ya minggu ini??
        </p>
        <h2 className="text-2xl font-black text-[#4A3728]">Riwayat Pesanan</h2>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="bg-[#B08968] rounded-[2rem] p-5 shadow-lg text-white flex justify-between items-center transition-transform active:scale-95"
          >
            {/* Sisi Kiri: Gambar dan Info Produk */}
            <div className="flex gap-4 items-center">
              {/* Thumbnail Produk */}
              <div className="w-14 h-14 bg-[#6F4E37] rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                <img 
                  src={item.image || "/placeholder-kopi.jpg"} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div>
                <p className="text-[10px] uppercase tracking-tighter opacity-80 font-bold">Kopi</p>
                <h3 className="text-md font-extrabold leading-tight">{item.name}</h3>
                {/* Badge Status Selesai */}
                <span className="inline-block bg-[#80B918] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full mt-1 shadow-sm">
                  {item.statusLabel || 'Selesai'}
                </span>
              </div>
            </div>

            {/* Sisi Kanan: Jumlah, Harga, dan Icon */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                {/* Badge Jumlah Item */}
                <div className="bg-[#FB8500] px-4 py-0.5 rounded-xl font-black inline-block text-sm mb-1 shadow-sm">
                  {item.quantity}
                </div>
                {/* Harga dengan format Rupiah */}
                <p className="text-sm font-black tracking-tight">
                  Rp {item.price?.toLocaleString('id-ID')}
                </p>
              </div>
              
              {/* Icon dropdown sesuai desain */}
              <ChevronDown className="w-5 h-5 opacity-70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiwayatPesanan;