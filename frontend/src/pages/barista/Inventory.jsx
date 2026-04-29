import Sidebar from '../../components/Sidebar/Sidebar';
import { Package, AlertTriangle } from 'lucide-react';

const Inventory = () => {
  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <Sidebar role="barista" />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Inventory</h1>
          <p className="text-gray-500">Stok bahan baku kopi dan perlengkapan.</p>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Bahan Baku</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              <tr>
                <td className="px-6 py-4 font-bold">Bijih Kopi Arabica</td>
                <td className="px-6 py-4">2.5 Kg</td>
                <td className="px-6 py-4 text-green-500 font-bold">Aman</td>
              </tr>
              <tr className="bg-red-50/50">
                <td className="px-6 py-4 font-bold">Susu Full Cream</td>
                <td className="px-6 py-4">2 Liter</td>
                <td className="px-6 py-4 text-red-500 font-bold flex items-center gap-1">
                  <AlertTriangle size={14} /> Hampir Habis
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Inventory;