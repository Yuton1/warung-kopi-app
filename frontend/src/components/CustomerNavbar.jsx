import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, ChevronDown, User, Menu, X, ShoppingBag, Coffee, History, UserCheck } from 'lucide-react'
import { STORAGE_KEYS, readStoredValue } from '../data/customerStorage'

const navItems = [
  { to: '/', end: true, label: 'Home', type: 'link' },
  { label: 'Menu', type: 'dropdown' },
  { to: '/pesanan', label: 'Pesanan', type: 'link', badge: 'orders' },
  { to: '/member', label: 'Member', type: 'link' },
  { to: '/cart', label: 'Keranjang', type: 'link', badge: 'cart' },
]

const menuDropdownItems = [
  { label: '☕ Minuman', to: '/menu/minuman' },
  { label: '🍰 Makanan', to: '/menu/makanan' },
  { label: '🍿 Cemilan', to: '/menu/cemilan' },
]

const CustomerNavbar = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [counts, setCounts] = useState({ orders: 0, cart: 0 })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // State interaksi UI responsif
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const updateState = () => {
      const cart = readStoredValue(STORAGE_KEYS.cart, [])
      const history = readStoredValue(STORAGE_KEYS.history, [])
      const preOrder = readStoredValue(STORAGE_KEYS.preorder, null)
      const auth = readStoredValue(STORAGE_KEYS.auth, null)

      setCounts({
        cart: Array.isArray(cart) ? cart.reduce((total, item) => total + (Number(item.qty) || 0), 0) : 0,
        orders: (Array.isArray(history) ? history.length : 0) + (preOrder ? 1 : 0),
      })
      setIsLoggedIn(Boolean(auth?.email))
    }

    updateState()
    window.addEventListener('storage', updateState)
    window.addEventListener('warungkopi-state-changed', updateState)
    
    // Menutup dropdown otomatis jika mengklik di luar area komponen
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('storage', updateState)
      window.removeEventListener('warungkopi-state-changed', updateState)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = searchValue.trim()
    if (!query) return
    navigate(`/?q=${encodeURIComponent(query)}`, { replace: false })
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full font-['Fredoka'] backdrop-blur-md bg-[#fcf8f4]/85 border-b border-[#f0e2d5]/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. BRAND LOGO */}
        <Link to="/" className="shrink-0 transform hover:scale-105 active:scale-95 transition-all duration-200">
          <img src="/Logo_Warkop_Nav.png" alt="Logo Warung Kopi" className="h-10 w-auto" />
        </Link>

        {/* 2. BAR PENCARIAN (Tampilan Desktop & Tablet Menengah) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xs lg:max-w-md xl:max-w-lg mx-4 group relative"
        >
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b08968] group-focus-within:text-[#4a2c11] transition-colors duration-200">
              <Search className="w-4 h-4 group-focus-within:scale-110 transition-transform" />
            </span>
            <input
              type="search"
              placeholder="Mau minum kopi apa hari ini?..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/70 border border-[#f0e2d5] text-[#2c1b0e] placeholder-gray-400 focus:outline-none focus:border-[#b08968] focus:bg-white focus:ring-4 focus:ring-[#b08968]/10 transition-all duration-300 text-sm shadow-inner"
            />
          </div>
        </form>

        {/* 3. MENU NAVIGASI UTAMA (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            // Dropdown Menu Kategori
            if (item.type === 'dropdown') {
              return (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isDropdownOpen 
                        ? 'bg-[#4a2c11] text-white shadow-sm' 
                        : 'text-[#4b3729] hover:bg-[#f7ece1]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Card Pop-over */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-[#f0e2d5] p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      {menuDropdownItems.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            navigate(opt.to)
                            setIsDropdownOpen(false)
                          }}
                          className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium text-[#4b3729] hover:bg-[#fcf8f4] hover:text-[#4a2c11] transition-all duration-150"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            // Elemen NavLink Standar
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-[#4a2c11] text-white shadow-sm' 
                    : 'text-[#4b3729] hover:bg-[#f7ece1]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && counts[item.badge] > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-black text-white animate-bounce">
                    {counts[item.badge]}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* 4. USER PROFILE / AUTH ACTION (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-2">
          {isLoggedIn ? (
            <Link 
              to="/akun" 
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 border border-[#f0e2d5] text-[#b08968] hover:text-[#4a2c11] hover:border-[#b08968] hover:shadow-sm hover:bg-white transition-all duration-200 active:scale-95"
              title="Profil Saya"
            >
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#4a2c11] text-white hover:bg-[#3d2510] shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              Login
            </Link>
          )}
        </div>

        {/* 5. MENU MOBILE TOGGLE BUTTON */}
        <div className="flex items-center lg:hidden gap-1.5">
          {isLoggedIn && (
            <Link to="/akun" className="p-2.5 text-[#b08968] hover:text-[#4a2c11] transition-colors">
              <User className="w-5 h-5" />
            </Link>
          )}
          
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/80 border border-[#f0e2d5] text-[#4b3729] hover:bg-[#fcf8f4] transition-all duration-200 active:scale-95"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 animate-in spin-in-90 duration-200" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* 📱 MOBILE OVERLAY DROPDOWN BOX */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#f0e2d5]/60 bg-[#fcf8f4] px-4 py-5 space-y-4 shadow-inner animate-in slide-in-from-top-4 duration-300">
          
          {/* Form Pencarian Versi Seluler */}
          <form onSubmit={handleSearchSubmit} className="block md:hidden relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b08968]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="search"
              placeholder="Cari menu kopi harian..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-[#f0e2d5] text-sm text-[#2c1b0e] focus:outline-none focus:border-[#b08968]"
            />
          </form>

          {/* List Menu Link Seluler */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              if (item.type === 'dropdown') {
                return (
                  <div key={item.label} className="pt-2 pb-1">
                    <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#b08968] block mb-2">
                      Kategori Pilihan Menu
                    </span>
                    <div className="grid grid-cols-3 gap-2 px-1">
                      {menuDropdownItems.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            navigate(opt.to)
                            setIsMobileMenuOpen(false)
                          }}
                          className="py-2.5 px-2 text-center bg-white border border-[#f0e2d5] text-xs font-semibold rounded-xl text-[#4b3729] active:bg-[#f7ece1] transition-colors"
                        >
                          {opt.label.substring(3) /* Potong icon emoji depan */}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-[#4a2c11] text-white' : 'text-[#4b3729] hover:bg-[#f7ece1]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && counts[item.badge] > 0 && (
                    <span className="bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                      {counts[item.badge]} Item
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Tombol Login Seluler */}
          {!isLoggedIn && (
            <div className="pt-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center py-3 bg-[#4a2c11] text-white rounded-xl text-sm font-bold shadow-sm active:bg-[#3d2510] transition-colors"
              >
                Login Akun
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default CustomerNavbar