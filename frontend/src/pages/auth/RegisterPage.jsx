import React, { useState } from 'react';
import { Mail, Lock, User, Apple, Chrome, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mendaftar dengan:", formData);
    // Logic register ke TiDB di sini
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-[400px] bg-[#161616] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl border-2 border-blue-500 flex items-center justify-center bg-zinc-900 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin"></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Already have an account? <span onClick={() => navigate('/login')} className="text-white hover:underline cursor-pointer font-medium">Login</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="relative group">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Full Name"
              className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#0070f3] hover:bg-blue-600 text-white font-medium py-3 rounded-lg mt-2 transition-all shadow-lg shadow-blue-500/20">
            Register
          </button>
        </form>

        {/* Social Register */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="px-3 text-[10px] text-zinc-600 uppercase tracking-widest">OR</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button className="flex justify-center items-center py-2.5 bg-[#1f1f1f] border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"><Apple size={20} /></button>
          <button className="flex justify-center items-center py-2.5 bg-[#1f1f1f] border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"><Chrome size={18} /></button>
          <button className="flex justify-center items-center py-2.5 bg-[#1f1f1f] border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"><Twitter size={18} /></button>
        </div>
      </div>
    </div>
  );
}