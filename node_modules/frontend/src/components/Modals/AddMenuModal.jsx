import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const AddMenuModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'minuman',
    stock: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim data ke parent (MenuManagement)
    onAdd({
      ...formData,
      id: Date.now(), // ID sementara sebelum konek database
      price: parseInt(formData.price),
      stock: parseInt(formData.stock)
    });
    // Reset form dan tutup
    setFormData({ name: '', price: '', category: 'minuman', stock: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#2c1b0e]">Tambah Menu Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Menu</label>
            <input
              required
              type="text"
              placeholder="Contoh: Es Kopi Gula Aren"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e39b4f] outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Harga (Rp)</label>
              <input
                required
                type="number"
                placeholder="15000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e39b4f] outline-none"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Stok Awal</label>
              <input
                required
                type="number"
                placeholder="50"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e39b4f] outline-none"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e39b4f] outline-none appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="minuman">Minuman</option>
              <option value="makanan">Makanan</option>
              <option value="cemilan">Cemilan</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#e39b4f] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#c9863e] transition-all mt-4"
          >
            <Save size={20} />
            Simpan Menu
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuModal;