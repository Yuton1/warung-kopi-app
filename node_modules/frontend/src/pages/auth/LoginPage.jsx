import React, { useState } from 'react';
import { Mail, Lock, Apple, Chrome, Twitter } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic login kamu nanti di sini
    console.log("Login dengan:", { email, password });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans text-white">
      {/* Container Utama */}
      <div className="w-full max-w-[400px] bg-[#161616] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Logo WarungKopi - Animasi Ring */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl border-2 border-blue-500 flex items-center justify-center bg-zinc-900 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Don't have an account yet? <span className="text-white hover:underline cursor-pointer font-medium">Sing up</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email address"
              className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0070f3] hover:bg-blue-600 text-white font-medium py-3 rounded-lg mt-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="px-3 text-[10px] text-zinc-600 uppercase tracking-[0.2em]">OR</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-3">
          <button className="flex justify-center items-center py-2.5 bg-[#1f1f1f] border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">
            <Apple size={20} />
          </button>
          <button className="flex justify-center items-center py-2.5 bg-[#1f1f1f] border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">
            <Chrome size={18} />
          </button>
          <button className="flex justify-center items-center py-2.5 bg-[#1f1f1f] border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">
            <Twitter size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}