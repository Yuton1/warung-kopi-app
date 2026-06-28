import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
          style={{ 
            width: '16px', 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s ease' 
          }}
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
    default:
      return null
  }
}

const CustomerNavbar = () => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const [searchValue, setSearchValue] = useState('')
  const [counts, setCounts] = useState({ orders: 0, cart: 0 })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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
    
    // Close dropdown when clicking outside
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
  }

  return (
    <header className="site-header" style={{ backgroundColor: '#ffffff', position: 'relative', zIndex: 100 }}>
      <div className="customer-navbar__inner">
        
        {/* LOGO */}
        <Link to="/" className="brand-link brand-link--navbar">
          <img src="/Logo_Warkop_Nav.png" alt="Logo Warung Kopi" style={{ height: '40px', width: 'auto' }} />
        </Link>

        {/* SEARCH FORM */}
        <form
          className="customer-navbar__search"
          onSubmit={handleSearchSubmit}
          style={{ flex: 1, marginLeft: '80px', marginRight: '80px', maxWidth: '900px' }}
        >
          <div className="customer-navbar__search-container" style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8', pointerEvents: 'none' }}>
              <Icon name="search" />
            </span>
            <input
              className="customer-navbar__search-input"
              type="search"
              placeholder="Cari menu..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '100%', paddingLeft: '45px' }}
            />
          </div>
        </form>

        {/* NAV ACTIONS */}
        <div className="customer-navbar__actions">
          <nav className="customer-navbar__nav" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {navItems.map((item) => {
              if (item.type === 'dropdown') {
                return (
                  <div key={item.label} className="customer-navbar__menu-group" ref={dropdownRef} style={{ position: 'relative' }}>
                    <button 
                      type="button"
                      className={`customer-navbar__pill customer-navbar__pill--menu ${isDropdownOpen ? 'customer-navbar__pill--active' : ''}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <span>{item.label}</span>
                      <Icon name="chevron-down" isOpen={isDropdownOpen} />
                    </button>

                    {/* ANIMATED DROPDOWN */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -12, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} // Custom premium ease-out
                          className="customer-navbar__dropdown"
                          style={{
                            position: 'absolute',
                            top: '120%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#fffdfa', // Warna krem warkop bersih
                            border: '1px solid #eaddcf',
                            borderRadius: '12px',
                            padding: '8px',
                            boxShadow: '0 10px 25px -5px rgba(45, 26, 16, 0.1), 0 8px 10px -6px rgba(45, 26, 16, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            minWidth: '150px',
                            zIndex: 110
                          }}
                        >
                          {menuDropdownItems.map((opt) => (
                            <button 
                              key={opt.label} 
                              type="button" 
                              onClick={() => {
                                navigate(opt.to)
                                setIsDropdownOpen(false)
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px 16px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '500',
                                color: '#2d1a10', // KUNCI UTAMA: Mengubah warna font menjadi cokelat gelap
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f3e6d8'
                                e.target.style.color = '#c2410c' // Mengubah warna teks ke oranye hangat saat hover
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent'
                                e.target.style.color = '#2d1a10'
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              if (item.type === 'button') {
                return (
                  <button key={item.label} className="customer-navbar__pill" type="button" onClick={() => navigate('/', { state: item.state })}>
                    <span>{item.label}</span>
                    {item.badge && counts[item.badge] > 0 && <span className="customer-navbar__badge">{counts[item.badge]}</span>}
                  </button>
                )
              }

              return (
                <NavLink key={item.label} to={item.to} end={item.end} className={({ isActive }) => `customer-navbar__pill ${isActive ? 'customer-navbar__pill--active' : ''}`}>
                  <span>{item.label}</span>
                  {item.badge && counts[item.badge] > 0 && <span className="customer-navbar__badge">{counts[item.badge]}</span>}
                </NavLink>
              )
            })}
          </nav>

          {isLoggedIn ? (
            <Link to="/akun" className="customer-navbar__profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="user" />
            </Link>
          ) : (
            <Link to="/login" className="customer-navbar__pill customer-navbar__pill--active">
              Login
            </Link>
          )
        }
        </div>

      </div>
    </header>
  )
}

export default CustomerNavbar