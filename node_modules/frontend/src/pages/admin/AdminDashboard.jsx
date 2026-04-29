import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage';
import Sidebar from '../../components/Sidebar/Sidebar'; // Import Sidebar dari folder components
import { Users, Coffee, TrendingUp, DollarSign } from 'lucide-react'; // Icon untuk statistik

const AdminDashboard = () => {
  const navigate = useNavigate();
  const auth = readStoredValue(STORAGE_KEYS.auth);
  const [reportPeriod, setReportPeriod] = useState('Daily'); // State untuk filter laporan

  // Proteksi: Jika bukan admin, tendang ke login
  useEffect(() => {
    if (!auth || auth.role !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [auth, navigate]);

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar - Pastikan Sidebar.jsx sudah ada di folder components */}
      <Sidebar role="admin" /> 

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Admin Dashboard</h1>
            <p className="text-gray-500">Selamat datang kembali, {auth?.name || 'Admin'}</p>
          </div>
          
          {/* Tab Filter Laporan */}
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((period) => (
              <button
                key={period}
                onClick={() => setReportPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  reportPeriod === period 
                  ? 'bg-[#e39b4f] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </header>

        {/* Stats Grid - Mirip image_88d95c.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Earnings" value="Rp 12.500.000" icon={<DollarSign color="#e39b4f"/>} trend="+12% vs last month" />
          <StatCard title="New Customers" value="140" icon={<Users color="#e39b4f"/>} trend="+20% vs last month" />
          <StatCard title="Orders Processed" value="56" icon={<Coffee color="#e39b4f"/>} trend="-5% vs yesterday" />
          <StatCard title="Loyalty Points" value="2.450" icon={<TrendingUp color="#e39b4f"/>} trend="Active members" />
        </div>

        {/* Main Analytics Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section (Placeholder) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-[#2c1b0e]">Sales Analytics ({reportPeriod})</h3>
            <div className="h-80 w-full bg-gray-50 rounded-2xl flex items-center justify-center border-dashed border-2 border-gray-200">
              <p className="text-gray-400 font-medium">Visualisasi Grafik {reportPeriod} akan muncul di sini</p>
            </div>
          </div>

          {/* Top Products / Recent Activity */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-[#2c1b0e]">Recent Orders</h3>
            <div className="space-y-4">
               {/* Contoh list pesanan */}
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                   <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-[#e39b4f] font-bold">#</div>
                   <div>
                     <p className="text-sm font-bold text-gray-800">Order #00{i}</p>
                     <p className="text-xs text-gray-500">2 mins ago</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-komponen StatCard agar kode rapi
const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-orange-50 rounded-2xl">{icon}</div>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
      <h4 className="text-2xl font-black text-[#2c1b0e] mt-1">{value}</h4>
      <p className="text-xs font-semibold text-green-500 mt-2">{trend}</p>
    </div>
  </div>
);

export default AdminDashboard;