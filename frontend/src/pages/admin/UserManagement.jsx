// C:\laragon\www\WarungKopi\frontend\src\pages\admin\UserManagement.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Search, Trash2, UserPlus, X, Shield, UserCheck } from 'lucide-react';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'customer' 
  });

  const API_BASE_URL = getApiBaseUrl();
  const API_URL = API_BASE_URL ? `${API_BASE_URL}/api/users` : '/api/users';
  const REGISTER_URL = API_BASE_URL ? `${API_BASE_URL}/api/auth/register` : '/api/auth/register';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Endpoint register biasanya bisa digunakan untuk pembuatan akun manual
      await axios.post(REGISTER_URL, newUser);
      setIsModalOpen(false);
      setNewUser({ username: '', email: '', password: '', role: 'customer' });
      fetchUsers(); // Refresh daftar tabel
    } catch (err) {
      alert("Gagal menambah user: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">User Management</h1>
            <p className="text-gray-500">Pantau pelanggan dan atur hak akses akun.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#e39b4f] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#c9863e] transition shadow-lg shadow-orange-900/20"
          >
            <UserPlus size={20} /> Tambah Akun Baru
          </button>
        </header>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari username atau email..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel User */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-[#2c1b0e]">{user.username}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                      user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 
                      user.role === 'barista' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {user.role === 'admin' ? <Shield size={12}/> : <UserCheck size={12}/>}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Pop-up Tambah User */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-black text-[#2c1b0e] mb-2">Buat Akun Baru</h2>
              <p className="text-sm text-gray-500 mb-6">Daftarkan Barista atau User secara manual.</p>
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase px-1">Username</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e39b4f] outline-none transition"
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase px-1">Email</label>
                  <input 
                    type="email" required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e39b4f] outline-none transition"
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase px-1">Password</label>
                  <input 
                    type="password" required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e39b4f] outline-none transition"
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase px-1">Role Akses</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#e39b4f]"
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    value={newUser.role}
                  >
                    <option value="customer">Customer (Pelanggan)</option>
                    <option value="barista">Barista (Staf)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#2c1b0e] text-white py-4 rounded-2xl font-bold mt-4 hover:bg-[#3d2b1d] transition shadow-lg shadow-black/20"
                >
                  Simpan Akun
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
