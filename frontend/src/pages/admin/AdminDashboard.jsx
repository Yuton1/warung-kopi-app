import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar'; // Panggil dari folder components

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar dipanggil di sini */}
      <Sidebar role="admin" /> 

      <main className="flex-1 p-8">
        {/* Konten Dashboard Admin */}
      </main>
    </div>
  );
};