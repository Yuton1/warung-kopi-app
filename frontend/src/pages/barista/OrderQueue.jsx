import React, { useState } from 'react';
import { formatRupiah } from '../../utils/formatRupiah';

const OrdersQueue = () => {
  // Dummy data dari tabel orders & order_items
  const [activeOrders, setActiveOrders] = useState([
    {
      id: 'ORD-001',
      type: 'Dine-in',
      table: 'Meja 05',
      status: 'Preparing',
      items: [
        { name: 'Kopi Hitam Racik', size: 'Normal', qty: 2 },
        { name: 'Kopi Kapal Api', size: 'Besar', qty: 1 }
      ],
      time: '10 Menit lalu'
    },
    {
      id: 'ORD-002',
      type: 'Takeaway',
      table: '-',
      status: 'Pending',
      items: [
        { name: 'Kopi TOP', size: 'Normal', qty: 1 }
      ],
      time: '2 Menit lalu'
    }
  ]);

  return (
    <div className="min-h-screen bg-[#F4F4F4] font-['Fredoka'] p-8 text-[#4A3728]">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight">Antrean Pesanan</h1>
          <p className="text-gray-500 text-lg">Semangat menyeduh, Barista! ☕</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-[#FF6E00]">
            <p className="text-xs text-gray-400">Pesanan Aktif</p>
            <p className="text-2xl font-bold">{activeOrders.length}</p>
          </div>
        </div>
      </header>

      {/* Grid Antrean */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-[2rem] overflow-hidden shadow-md border border-gray-100 flex flex-col transition-all hover:shadow-xl">
            {/* Header Card */}
            <div className={`p-6 flex justify-between items-center ${order.type === 'Takeaway' ? 'bg-orange-50' : 'bg-blue-50'}`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{order.id}</span>
                <h2 className="text-xl font-bold">{order.type} {order.table !== '-' && `• ${order.table}`}</h2>
              </div>
              <span className="text-sm font-medium bg-white px-4 py-1.5 rounded-full shadow-sm">{order.time}</span>
            </div>

            {/* List Item */}
            <div className="p-6 flex-1 space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#FDF7F2] p-4 rounded-2xl">
                  <div>
                    <p className="font-bold text-lg">{item.name}</p>
                    <p className="text-sm text-gray-500 uppercase">{item.size}</p>
                  </div>
                  <div className="bg-[#4A3728] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {item.qty}x
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="p-6 bg-gray-50 flex gap-3">
              {order.status === 'Pending' ? (
                <button className="flex-1 bg-[#4A3728] text-white py-4 rounded-xl font-bold hover:brightness-110 transition-all">
                  Mulai Proses
                </button>
              ) : (
                <button className="flex-1 bg-[#FF6E00] text-white py-4 rounded-xl font-bold hover:brightness-110 transition-all">
                  Selesai / Panggil
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersQueue;