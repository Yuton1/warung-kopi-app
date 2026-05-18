import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS, readStoredValue } from '../data/customerStorage'

const navItems = [
  { to: '/', end: true, label: 'Home', state: null, type: 'link' },
  { label: 'Menu', type: 'dropdown' },
  { to: '/pesanan', label: 'Pesanan', state: null, type: 'link', badge: 'orders' },
  { to: '/member', label: 'Member', state: null, type: 'link' },
  { to: '/cart', label: 'Keranjang', state: null, type: 'link', badge: 'cart' },
]

const menuDropdownItems = [
  { label: 'Minuman', to: '/menu/minuman' },
  { label: 'Makanan', to: '/menu/makanan' },
  { label: 'Cemilan', to: '/menu/cemilan' },
]

// Icon modern SVG bawaan dengan micro-animation hover efek
const Icon = ({ name, isOpen }) => {
  switch (name) {
    case 'search':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )
    case 'chevron-down':
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          style={{ width: '16px' }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px' }}>
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      )
    case 'menu':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      )
    case 'close':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      )
    default:
      return null
  }
}

const CustomerNavbar = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [counts, setCounts] = useState({ orders: 0, cart: 0 })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // State Baru untuk Handling Interaktivitas Responsif & Animasi
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

    // Menutup dropdown otomatis jika klik di luar komponen area desktop
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
    // Menggunakan perpaduan warna transparan krem warkop + blur agar menyatu halus dengan bg body
    <header className="site-header sticky top-0 z-50 backdrop-blur-md bg-[#fcf8f4]/80 border-b border-[#f0e2d5]/60 shadow-sm transition-all duration-300 font-['Fredoka']">
      <div className="customer-navbar__inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', height: '80px' }}>
        
        {/* LOGO */}
        <Link to="/" className="brand-link brand-link--navbar transform hover:scale-105 active:scale-95 transition-transform duration-200">
          <img src="/Logo_Warkop_Nav.png" alt="Logo Warung Kopi" style={{ height: '40px', width: 'auto' }} />
        </Link>

        {/* SEARCH FORM (Hidden di mobile kecil, flex lebar di desktop) */}
        <form
          className="customer-navbar__search hidden md:flex"
          onSubmit={handleSearchSubmit}
          style={{ flex: 1, marginLeft: '40px', marginRight: '40px', maxWidth: '600px' }}
        >
          <div className="customer-navbar__search-container" style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#b08968', pointerEvents: 'none' }}>
              <Icon name="search" />
            </span>
            <input
              className="customer-navbar__search-input"
              type="search"
              placeholder="Cari menu kopi favoritmu..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ 
                width: '100%', 
                paddingLeft: '45px', 
                backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                border: '1px solid #f0e2d5',
                borderRadius: '12px',
                height: '42px'
              }}
            />
          </div>
        </form>

        {/* ACTIONS & NAVIGATION */}
        <div className="customer-navbar__actions" style={{ display: 'flex', itemsCenter: 'center', gap: '12px' }}>
          
          {/* NAV LINKS (Hanya Muncul di Layar Desktop Large) */}
          <nav className="customer-navbar__nav hidden lg:flex" style={{ display: 'flex', gap: '8px', itemsCenter: 'center' }}>
            {navItems.map((item) => {
              // Pengganti <details> kaku dengan State React Controlled Dropdown
              if (item.type === 'dropdown') {
                return (
                  <div key={item.label} className="relative" ref={dropdownRef}>
                    <button 
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`customer-navbar__pill customer-navbar__pill--menu flex items-center gap-1 transition-all duration-200 active:scale-95 ${isDropdownOpen ? 'customer-navbar__pill--active' : ''}`}
                    >
                      <span>{item.label}</span>
                      <Icon name="chevron-down" isOpen={isDropdownOpen} />
                    </button>
                    
                    {/* Dropdown Box dengan Animasi Pop-In */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-[#f0e2d5] p-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        {menuDropdownItems.map((opt) => (
                          <button 
                            key={opt.label} 
                            type="button" 
                            onClick={() => {
                              navigate(opt.to)
                              setIsDropdownOpen(false)
                            }}
                            className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold text-[#4b3729] hover:bg-[#fcf8f4] hover:text-[#4a2c11] transition-all duration-150"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <NavLink 
                  key={item.label} 
                  to={item.to} 
                  end={item.end} 
                  className={({ isActive }) => `customer-navbar__pill transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${isActive ? 'customer-navbar__pill--active' : ''}`}
                >
                  <span>{item.label}</span>
                  {item.badge && counts[item.badge] > 0 && (
                    <span className="customer-navbar__badge animate-bounce" style={{ backgroundColor: '#f59e0b', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>
                      {counts[item.badge]}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* USER PROFILE SHORTCUT ACCENT (Desktop) */}
          <div className="hidden sm:flex items-center">
            {isLoggedIn ? (
              <Link to="/akun" className="customer-navbar__profile transform hover:scale-110 active:scale-95 transition-all duration-200" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0e2d5', borderRadius: '12px', width: '40px', height: '40px', backgroundColor: '#fff' }}>
                <Icon name="user" />
              </Link>
            ) : (
              <Link to="/login" className="customer-navbar__pill customer-navbar__pill--active transition-all duration-200 active:scale-95">
                Login
              </Link>
            )}
          </div>

          {/* TOGGLE MENU HAMBURGER (Mobile & Tablet Viewport) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex lg:hidden p-2 rounded-xl bg-white border border-[#f0e2d5] text-[#4b3729] hover:bg-[#fcf8f4] active:scale-95 transition-all duration-200"
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} />
          </button>

        </div>
      </div>

      {/* 📱 MOBILE DRAWERS DRAWER OVERLAY (Hanya dirender saat menu hamburger aktif) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#f0e2d5]/60 bg-[#fcf8f4] px-4 py-4 space-y-4 shadow-inner animate-in slide-in-from-top-4 duration-300">
          
          {/* Form Pencarian Versi Mobile Kecil */}
          <form onSubmit={handleSearchSubmit} className="block md:hidden relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b08968] w-4 h-4">
              <Icon name="search" />
            </span>
            <input
              type="search"
              placeholder="Cari menu kopi harian..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#f0e2d5] text-sm text-[#2c1b0e]"
            />
          </form>

          {/* List Link Navigasi Vertikal Mobile */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              if (item.type === 'dropdown') {
                return (
                  <div key={item.label} className="py-2">
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#b08968] block mb-2">
                      Kategori Menu
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
                          className="py-2 px-1 text-center bg-white border border-[#f0e2d5] text-xs font-medium rounded-xl text-[#4b3729] active:bg-[#f7ece1]"
                        >
                          {opt.label}
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
                    <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {counts[item.badge]}
                    </span>
                  )}
                </NavLink>
              )
            })}
            
            {/* Login Link Khusus Tampilan Layar HP */}
            {!isLoggedIn && (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 mt-2 bg-[#4a2c11] text-white rounded-xl text-sm font-bold shadow-sm"
              >
                Login Akun
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default CustomerNavbar