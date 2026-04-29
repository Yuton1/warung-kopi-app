import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Gift, Star, ArrowUpRight, Plus, Trash2, Edit, Ticket, Search } from 'lucide-react';

const LoyaltyRewards = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Loyalty Rewards</h1>
            <p className="text-gray-500">Atur strategi poin dan katalog hadiah untuk pelanggan setia.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#e39b4f] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c9863e] transition">
            <Plus size={20} /> Tambah Item Hadiah
          </button>
        </header>

        {/* Highlight Stats - Memberikan info cepat ke Admin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Poin Terpakai" value="12.450" icon={<Ticket className="text-orange-500"/>} color="bg-orange-50" />
          <StatCard title="Klaim Hari Ini" value="15" icon={<Gift className="text-purple-500"/>} color="bg-purple-50" />
          <StatCard title="Konversi Poin" value="Rp 1.000 / Poin" icon={<Star className="text-yellow-500"/>} color="bg-yellow-50" />
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama hadiah..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Reward Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Katalog Hadiah</th>
                <th className="px-6 py-4">Syarat Poin</th>
                <th className="px-6 py-4">Sisa Stok</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <RewardRow name="Americano Gratis" points="40" stock="Unlimited" />
              <RewardRow name="Voucher Diskon 20%" points="150" stock="20" />
              <RewardRow name="Tumbler Kayu Eksklusif" points="1000" stock="5" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-6 rounded-[2rem] border border-white shadow-sm`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white rounded-2xl shadow-sm">{icon}</div>
    </div>
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <h2 className="text-2xl font-black text-[#2c1b0e]">{value}</h2>
  </div>
);

const RewardRow = ({ name, points, stock }) => (
  <tr className="hover:bg-gray-50 transition">
    <td className="px-6 py-4 font-bold text-[#2c1b0e]">{name}</td>
    <td className="px-6 py-4 font-semibold text-orange-600">{points} Poin</td>
    <td className="px-6 py-4 text-gray-600">{stock}</td>
    <td className="px-6 py-4">
      <div className="flex justify-center gap-2">
        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit size={18}/></button>
        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
      </div>
    </td>
  </tr>
);

export default LoyaltyRewards;