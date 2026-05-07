import React from 'react';
import OrderAktif from './orderaktif/OrderAktif';
import RiwayatPesanan from './riwayatpesanan/RiwayatPesanan';

const PesananPage = () => {
  // Data dummy untuk pesanan yang sedang diproses (Order Aktif)
  // currentStep: 0 (Pemesanan), 1 (Pembayaran), 2 (Proses), 3 (Siap Diambil), 4 (Selesai)
  const activeOrders = [
    {
      id: "ORD-001",
      name: 'Ice Americano',
      image: '/Logo_Warkop_Nav.png', // Pastikan path image benar
      statusLabel: 'Proses',
      quantity: 2,
      price: 10000,
      currentStep: 2,
      time: '04:50 PM',
      date: 'Senin, 15-Januari-2025'
    },
    {
      id: "ORD-002",
      name: 'Ice Americano',
      image: '/Logo_Warkop_Nav.png',
      statusLabel: 'Siap Diambil',
      quantity: 2,
      price: 10000,
      currentStep: 3,
      time: '04:55 PM',
      date: 'Senin, 15-Januari-2025'
    }
  ];

  // Data dummy untuk riwayat transaksi
  const historyOrders = [
    {
      id: "HIS-001",
      name: 'Ice Americano',
      image: '/Logo_Warkop_Nav.png',
      statusLabel: 'Selesai',
      quantity: 1,
      price: 5000,
    },
    {
      id: "HIS-002",
      name: 'Ice Americano',
      image: '/Logo_Warkop_Nav.png',
      statusLabel: 'Selesai',
      quantity: 1,
      price: 5000,
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5EBE0] pb-10">
      <div className="max-w-md mx-auto px-6 pt-12">
        
        {/* Header Halaman */}
        <header className="mb-8">
          <p className="text-[#6F4E37] text-sm font-semibold tracking-wide mb-1">
            Yuk Lihat Progres pesanan kamu !!
          </p>
          <h1 className="text-[2.5rem] font-black text-[#4A3728] leading-[1.1] tracking-tight">
            Tracking status order <br /> 
            <span className="text-[#6F4E37]/80">dan riwayat transaksi</span>
          </h1>
        </header>

        {/* Komponen Order Aktif */}
        <OrderAktif orders={activeOrders} />

        {/* Komponen Riwayat Pesanan */}
        <RiwayatPesanan history={historyOrders} />

      </div>

      {/* Navigasi Bawah (Opsional jika sudah ada di App.jsx) */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around">
         ... icon home, pesanan, dsb ...
      </div> 
      */}
    </div>
  );
};

export default PesananPage;