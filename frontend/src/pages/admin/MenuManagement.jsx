import { useState, useEffect } from 'react'; // Tambahkan useEffect
import axios from 'axios'; // Pastikan axios sudah di-import
import Sidebar from '../../components/Sidebar/Sidebar';
import { Plus, Edit3, Trash2, Search, Coffee, Utensils, Cookie } from 'lucide-react';
import AddMenuModal from '../../components/Modals/AddMenuModal';

const MenuManagement = () => {
  // 1. Ubah default state ke kategori database agar sinkron
  const [activeTab, setActiveTab] = useState('coffee'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menus, setMenus] = useState([]); // State sekarang kosong (nanti diisi dari DB)

  const API_URL = "http://localhost:3000/api/products";

  // 2. Ambil data asli dari TiDB saat komponen pertama kali dimuat
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setMenus(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  // 3. Fungsi Tambah Menu ke Database
  const handleAddMenu = async (formData) => {
    const payload = {
      ...formData,
      initials: formData.name.substring(0, 2).toUpperCase(),
      base_points: Math.floor(formData.price / 1000), // Poin loyalitas otomatis
      is_available: true
    };

    try {
      const res = await axios.post(API_URL, payload);
      // Tambahkan data baru ke paling atas tabel
      setMenus([res.data, ...menus]);
      setIsModalOpen(false);
    } catch (err) {
      alert("Cek koneksi backend atau kategori ENUM database!");
    }
  };

  // 4. Fungsi Hapus Menu dari Database
  const handleDeleteMenu = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        // Update tampilan secara instan dengan membuang item yang dihapus dari array
        setMenus(menus.filter(item => item.id !== id));
      } catch (err) {
        alert("Gagal menghapus menu dari database");
      }
    }
  };

  const filteredMenu = menus.filter(item => {
      // Logika agar tab 'coffee' juga menampilkan data 'minuman'
      const isCoffee = activeTab === 'coffee' && (item.category === 'coffee' || item.category === 'minuman');
      const isMeal = activeTab === 'meal' && (item.category === 'meal' || item.category === 'makanan');
      const isSnack = activeTab === 'snack' && (item.category === 'snack' || item.category === 'cemilan');
      const isNonCoffee = activeTab === 'non-coffee' && item.category === 'non-coffee';

      return (isCoffee || isMeal || isSnack || isNonCoffee) && 
             item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar role="admin" />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Menu Management</h1>
            <p className="text-gray-500">Atur ketersediaan produk dan harga di sini.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#e39b4f] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c9863e] transition"
          >
            <Plus size={20} />
            Tambah Menu Baru
          </button>
        </header>

        {/* Filter & Search Bar - Menggunakan Kategori Database (ENUM) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <TabButton active={activeTab === 'coffee'} onClick={() => setActiveTab('coffee')}/>
            <TabButton active={activeTab === 'non-coffee'} onClick={() => setActiveTab('non-coffee')}/>
            <TabButton active={activeTab === 'meal'} onClick={() => setActiveTab('meal')}/>
            <TabButton active={activeTab === 'snack'} onClick={() => setActiveTab('snack')}/>
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
              {filteredMenu.length > 0 ? (
                filteredMenu.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-bold text-[#2c1b0e]">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-orange-50 text-[#e39b4f] px-3 py-1 rounded-full text-xs font-semibold capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">{item.stock} unit</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit3 size={18}/></button>
                        <button onClick={() => handleDeleteMenu(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">Belum ada menu di kategori ini.</td>
                </tr>
              )}
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

// Komponen Kecil TabButton agar kode tetap bersih
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