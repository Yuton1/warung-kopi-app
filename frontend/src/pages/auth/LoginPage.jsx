import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setError(data.message || 'Username atau password salah!');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] font-['Poppins'] overflow-hidden">
      
      {/* LEFT PANEL - Branding with Background Image */}
      <div className="hidden relative w-1/2 md:flex flex-col justify-center items-center p-12 overflow-hidden">
        {/* Background Image dari folder public */}
        <img 
          src="/Gambar_Login.jpg" 
          alt="Coffee Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay agar teks terbaca jelas */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        {/* Dekorasi Biji Kopi (CSS Floating Beans) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
            {[...Array(8)].map((_, i) => (
                <div key={i} className={`absolute w-5 h-7 bg-[#c19a6b] rounded-full blur-[1px] animate-pulse`} 
                     style={{ 
                         top: `${Math.random() * 100}%`, 
                         left: `${Math.random() * 100}%`,
                         transform: `rotate(${Math.random() * 360}deg)` 
                     }} 
                />
            ))}
        </div>

        <div className="relative z-10 text-center max-w-md animate-fadeInLeft">
          <div className="mb-8">
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Selamat Datang di <span className="text-[#c19a6b]">WarungKopi</span>
          </h1>
          <p className="text-gray-300 font-light leading-relaxed">
            Nikmati pengalaman mengelola kedai kopi Anda dengan mudah dan efisien. 
            Sistem manajemen terpadu untuk bisnis kopi Anda.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-16 bg-[#1a1a1a] relative">
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#c19a6b]/30 to-transparent hidden md:block" />
        
        <div className="w-full max-w-md space-y-8">
          <div className="animate-fadeInUp">
            <span className="text-[#c19a6b] text-xs font-semibold tracking-[0.2em] uppercase">Welcome Back</span>
            <h2 className="text-3xl font-bold text-white mt-2">Masuk ke Akun</h2>
            <p className="text-gray-500 text-sm mt-2 font-light">Masukkan kredensial Anda untuk melanjutkan</p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3 animate-shake">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl text-sm flex items-center gap-3">
              <i className="fas fa-check-circle"></i> Login berhasil! Mengalihkan...
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 animate-fadeInUp">
              <label className="text-xs font-medium text-gray-400 ml-1">Username</label>
              <div className="relative group">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c19a6b] transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#c19a6b] focus:ring-4 focus:ring-[#c19a6b]/10 transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 animate-fadeInUp">
              <label className="text-xs font-medium text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c19a6b] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#c19a6b] focus:ring-4 focus:ring-[#c19a6b]/10 transition-all placeholder:text-gray-600"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#c19a6b] transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs animate-fadeInUp">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer group">
                <input type="checkbox" className="hidden" />
                <div className="w-4 h-4 border border-white/20 rounded bg-white/5 group-hover:border-[#c19a6b] transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#c19a6b] rounded-sm hidden group-active:block" />
                </div>
                Ingat Saya
              </label>
              <Link to="/forgot-password" size="sm" className="text-[#c19a6b] hover:underline font-medium">Lupa Password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#c19a6b] to-[#a0784a] text-white font-bold rounded-xl shadow-lg shadow-[#c19a6b]/20 hover:shadow-[#c19a6b]/40 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed animate-fadeInUp"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : "Masuk"}
            </button>
          </form>

          <div className="relative py-4 animate-fadeInUp">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1a1a1a] px-4 text-gray-600 tracking-widest">atau masuk dengan</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4 animate-fadeInUp">
            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-all">
              <i className="fab fa-google text-red-500" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-all">
              <i className="fab fa-github" /> Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 animate-fadeInUp">
            Belum punya akun? <Link to="/register" className="text-[#c19a6b] font-bold hover:underline">Daftar Sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;