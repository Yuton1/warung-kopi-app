// src/pages/customer/MenuViewComponents/PreOrderSection.jsx
import React, { useState } from 'react';

const PreOrderSection = ({ onSave, onCancel, preOrder }) => {
  const [selectedTime, setSelectedTime] = useState(preOrder?.time || "");
  const [note, setNote] = useState(preOrder?.note || "");

  // List waktu cepat (Quick Pick)
  const quickTimes = ["08:30", "09:00", "12:30", "15:00", "17:00"];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#2B1B17] to-[#4A3728] rounded-[2.5rem] p-8 text-white shadow-2xl">
      {/* Dekorasi Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-2">Pre-order Scheduling</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Pesan sekarang, ambil nanti. Hindari antrean panjang dan pastikan kopi Anda siap saat Anda tiba.
          </p>
          
          {/* Input Waktu */}
          <div className="mt-6">
            <label className="text-[10px] uppercase tracking-widest font-bold text-orange-400">Pilih Jam Ambil</label>
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickTimes.map(t => (
                <button 
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedSize === t ? 'bg-orange-500 border-orange-500' : 'bg-white/10 border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
              <input 
                type="time" 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full lg:w-64">
          <textarea 
            placeholder="Catatan pengambilan (misal: Parkir depan)"
            className="bg-white/10 border border-white/20 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 h-20"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button 
            onClick={() => onSave({ time: selectedTime, note })}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
          >
            Simpan Jadwal
          </button>
          <button 
            onClick={onCancel}
            className="bg-white text-[#2B1B17] font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreOrderSection;