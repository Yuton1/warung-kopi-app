import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Plus, Edit3, Trash2, Search, Coffee, Utensils, Cookie } from 'lucide-react';
import AddMenuModal from '../../components/Modals/AddMenuModal';

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState('minuman');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data dummy (Nanti akan ditarik dari Database SQL Laragon)
  const [menus, setMenus] = useState([
    { id: 1, name: 'Es Kopi Susu Aren', price: 18000, category: 'minuman', stock: 25 },
    { id: 2, name: 'Nasi Goreng Spesial', price: 25000, category: 'makanan', stock: 10 },
    { id: 3, name: 'Kentang Goreng', price: 15000, category: 'cemilan', stock: 15 },
  ]);

  const filteredMenu = menus.filter(item => 
    item.category === activeTab && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMenu = (newMenu) => {
    setMenus([...menus, newMenu]); // Tambah data ke tabel secara real-time
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar role="admin" />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Menu Management</h1>
            <p className="text-gray-500">Atur ketersediaan produk dan harga di sini.</p>
          </div>
          {/* Tambahkan onClick disini */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#e39b4f] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c9863e] transition"
          >
            <Plus size={20} />
            Tambah Menu Baru
          </button>
        </header>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <TabButton active={activeTab === 'minuman'} onClick={() => setActiveTab('minuman')} icon={<Coffee size={18}/>} label="Minuman" />
            <TabButton active={activeTab === 'makanan'} onClick={() => setActiveTab('makanan')} icon={<Utensils size={18}/>} label="Makanan" />
            <TabButton active={activeTab === 'cemilan'} onClick={() => setActiveTab('cemilan')} icon={<Cookie size={18}/>} label="Cemilan" />
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama menu..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Menu */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Nama Menu</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredMenu.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-[#2c1b0e]">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-orange-50 text-[#e39b4f] px-3 py-1 rounded-full text-xs font-semibold capitalize">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">Rp {item.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">{item.stock} porsi</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit3 size={18}/></button>
                      <button onClick={() => handleDeleteMenu(item.id)}className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AddMenuModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddMenu} 
        />
      </main>
    </div>
  );
};

const handleDeleteMenu = (id) => {
  if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
    setMenus(menus.filter(item => item.id !== id));
  }
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
      active ? 'bg-white text-[#e39b4f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {icon} {label}
  </button>
);

export default MenuManagement;