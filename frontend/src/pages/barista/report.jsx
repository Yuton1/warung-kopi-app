import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Award, 
  Download, 
  Calendar,
  Coffee
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BaristaDailyReport() {
  const [reportData, setReportData] = useState({
    totalEarnings: 0,
    totalTransactions: 0,
    averageOrderValue: 0,
    topProducts: [],
    hourlySales: []
  });
  const [loading, setLoading] = useState(true);

  // Mengambil data harian khusus porsi Barista
  useEffect(() => {
    const fetchDailyReport = async () => {
      try {
        // Sesuaikan dengan endpoint API backend kamu
        // const response = await fetch('/api/barista/reports/daily');
        // const data = await response.json();
        
        // Mock data untuk menyesuaikan visualisasi grafik dan list produk terlaris
        const mockData = {
          totalEarnings: 4250000,
          totalTransactions: 142,
          averageOrderValue: 29929,
          topProducts: [
            { name: 'Kopi Susu Gula Aren', sold: 45, revenue: 1260000 },
            { name: 'Latte Gula Aren', sold: 32, revenue: 896000 },
            { name: 'Caramel Macchiato', sold: 28, revenue: 784000 },
            { name: 'Cireng Krispi', sold: 20, revenue: 200000 },
          ],
          hourlySales: [
            { time: '08:00', sales: 350000 },
            { time: '10:00', sales: 620000 },
            { time: '12:00', sales: 980000 },
            { time: '14:00', sales: 450000 },
            { time: '16:00', sales: 710000 },
            { time: '18:00', sales: 1140000 },
          ]
        };
        
        setReportData(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Gagal memuat laporan harian:", error);
        setLoading(false);
      }
    };

    fetchDailyReport();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcf9f5]">
        <div className="text-center">
          <Coffee className="mx-auto h-12 w-12 animate-bounce text-orange-500" />
          <p className="mt-4 text-gray-600 font-medium">Memproses laporan hari ini...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f5] p-6 lg:p-8">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2c1b0e] text-white rounded-lg">
              <TrendingUp size={20} />
            </div>
            <h1 className="text-2xl font-bold text-[#2c1b0e]">Daily Report</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Analisis performa penjualan, pesanan, dan menu terlaris shifts hari ini.
          </p>
        </div>
        
        <button 
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <Download size={16} />
          <span>Export Laporan</span>
        </button>
      </div>

      {/* Rangkuman Grid Ringkasan / Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Card 1: Pendapatan Hari Ini */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-700">Pendapatan Hari Ini</span>
            <div className="rounded-xl bg-emerald-500 p-2 text-white">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{formatRupiah(reportData.totalEarnings)}</h3>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Live dari kasir meja & takeaway
            </span>
          </div>
        </div>

        {/* Card 2: Total Transaksi */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-700">Total Transaksi</span>
            <div className="rounded-xl bg-blue-500 p-2 text-white">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{reportData.totalTransactions} Pesanan</h3>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              Semua status pesanan selesai
            </span>
          </div>
        </div>

        {/* Card 3: Rata-rata Nilai Pesanan */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-6 shadow-sm transition hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-orange-700">Rata-rata Pesanan</span>
            <div className="rounded-xl bg-orange-500 p-2 text-white">
              <Award size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{formatRupiah(reportData.averageOrderValue)}</h3>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-orange-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              Nilai pengeluaran per struk konsumen
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Grafik Lonjakan Pendapatan Jam Terpadat */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#2c1b0e]">Grafik Pendapatan Terkini</h2>
              <p className="text-xs text-gray-500">Tren grafik berdasarkan interval waktu operasional hari ini.</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
              <Calendar size={14} />
              <span>Hari Ini</span>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData.hourlySales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp ${v/1000}k`} />
                <Tooltip 
                  formatter={(value) => [formatRupiah(value), 'Pendapatan']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#f3f4f6', shadow: 'sm' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daftar Produk Terlaris Shift Ini */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="border-b border-gray-50 pb-4 mb-5">
            <h2 className="text-lg font-bold text-[#2c1b0e]">Produk Terlaris</h2>
            <p className="text-xs text-gray-500">Menu makanan & minuman paling banyak dibuat.</p>
          </div>

          <div className="divide-y divide-gray-50">
            {reportData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-orange-600">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sold} Porsi Terbuat</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-700">{formatRupiah(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}