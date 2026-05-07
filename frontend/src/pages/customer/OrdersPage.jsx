import React, { useState } from 'react';
import OrderAktif from './Pesanan/orderaktif/OrderAktif';
import RiwayatPesanan from './Pesanan/riwayatpesanan/RiwayatPesanan';

const OrdersPage = () => {
  // Data dummy untuk pesanan aktif (bisa dipindah ke state/API nantinya)
  const [activeOrders] = useState([
    {
      id: "ORD-128",
      name: 'Ice Americano',
      image: '/Logo_Warkop_Nav.png', 
      statusLabel: 'Proses',
      quantity: 2,
      price: 10000,
      currentStep: 2, // 2 = Tahap Proses
      time: '04:50 PM',
      date: 'Senin, 15-Januari-2026'
    },
    {
      id: "ORD-129",
      name: 'Ice Americano',
      image: '/Logo_Warkop_Nav.png',
      statusLabel: 'Siap Diambil',
      quantity: 2,
      price: 10000,
      currentStep: 3, // 3 = Tahap Siap Diambil
      time: '04:55 PM',
      date: 'Senin, 15-Januari-2026'
    }
  ]);

  // Data dummy untuk riwayat
  const [historyOrders] = useState([
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
  ]);

  return (
    <div className="min-h-screen bg-[#F5EBE0]">
      {/* Wrapper utama agar konten tidak terlalu lebar di desktop */}
      <div className="max-w-md mx-auto px-6 py-10">
        
        {/* Judul Halaman */}
        <header className="mb-10">
          <p className="text-[#6F4E37] text-sm font-bold mb-1 animate-pulse">
            Yuk Lihat Progres pesanan kamu !!
          </p>
          <h1 className="text-4xl font- text-[#4A3728] leading-none tracking-tighter">
            Tracking status order <br /> 
            <span className="text-[#6F4E37]/70 font-black">dan riwayat transaksi</span>
          </h1>
        </header>

        {/* List Pesanan yang sedang berjalan */}
        <section className="mb-12">
          <OrderAktif orders={activeOrders} />
        </section>

        {/* List Riwayat Pesanan */}
        <section>
          <RiwayatPesanan history={historyOrders} />
        </section>

      </div>
    </div>
  );
};

export default OrdersPage;