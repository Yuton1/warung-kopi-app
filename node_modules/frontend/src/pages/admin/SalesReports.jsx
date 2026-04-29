import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { 
  TrendingUp, DollarSign, ShoppingBag, 
  Download, Calendar, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

const SalesReports = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-8">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Sales Reports</h1>
            <p className="text-gray-500">Analisis performa penjualan dan pendapatan warung.</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-[#2c1b0e] border border-gray-200 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition">
            <Download size={18} /> Export Laporan
          </button>
        </header>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ReportCard 
            title="Pendapatan Bulan Ini" 
            value="Rp 12.450.000" 
            trend="+12.5%" 
            isPositive={true}
            icon={<DollarSign className="text-green-600"/>} 
            color="bg-green-50" 
          />
          <ReportCard 
            title="Total Transaksi" 
            value="452" 
            trend="+5.2%" 
            isPositive={true}
            icon={<ShoppingBag className="text-blue-600"/>} 
            color="bg-blue-50" 
          />
          <ReportCard 
            title="Rata-rata Pesanan" 
            value="Rp 27.544" 
            trend="-2.1%" 
            isPositive={false}
            icon={<TrendingUp className="text-orange-600"/>} 
            color="bg-orange-50" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Placeholder */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#2c1b0e]">Grafik Pendapatan</h3>
              <select 
                className="text-sm border-none bg-gray-100 rounded-lg px-3 py-1 focus:ring-0"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="weekly">Minggu Ini</option>
                <option value="monthly">Bulan Ini</option>
                <option value="yearly">Tahun Ini</option>
              </select>
            </div>
            {/* Area untuk Chart (Bisa menggunakan Recharts atau Chart.js nanti) */}
            <div className="h-64 w-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
              Visualisasi Grafik Penjualan
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#2c1b0e] mb-6">Produk Terlaris</h3>
            <div className="space-y-6">
              <TopProduct name="Kopi Susu Gula Aren" sold={145} price="Rp 2.175.000" />
              <TopProduct name="Caramel Macchiato" sold={92} price="Rp 2.576.000" />
              <TopProduct name="Indomie Goreng Special" sold={78} price="Rp 1.170.000" />
              <TopProduct name="Cireng Krispi" sold={65} price="Rp 650.000" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const ReportCard = ({ title, value, trend, isPositive, icon, color }) => (
  <div className={`${color} p-6 rounded-[2rem] border border-white shadow-sm`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white rounded-2xl shadow-sm">{icon}</div>
      <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {trend}
      </div>
    </div>
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <h2 className="text-2xl font-black text-[#2c1b0e]">{value}</h2>
  </div>
);

const TopProduct = ({ name, sold, price }) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="font-bold text-[#2c1b0e] text-sm">{name}</p>
      <p className="text-xs text-gray-500">{sold} Terjual</p>
    </div>
    <p className="font-bold text-[#e39b4f] text-sm">{price}</p>
  </div>
);

export default SalesReports;