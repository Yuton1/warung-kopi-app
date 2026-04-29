import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS, readStoredValue } from '../data/customerStorage'

// ... (navItems, menuDropdownItems, dan Icon tetap sama seperti kode kamu)

const CustomerNavbar = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [counts, setCounts] = useState({ orders: 0, cart: 0 })
  
  // State baru untuk mengecek apakah user sudah login
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const updateCounts = () => {
      const cart = readStoredValue(STORAGE_KEYS.cart, [])
      const history = readStoredValue(STORAGE_KEYS.history, [])
      const preOrder = readStoredValue(STORAGE_KEYS.preorder, null)
      
      // Asumsi: Kita menyimpan data user di localStorage dengan key 'user' atau 'token'
      // Sesuaikan dengan sistem login yang kamu buat di LoginPage sebelumnya
      const user = localStorage.getItem('user') 

      setCounts({
        cart: Array.isArray(cart) ? cart.reduce((total, item) => total + (Number(item.qty) || 0), 0) : 0,
        orders: (Array.isArray(history) ? history.length : 0) + (preOrder ? 1 : 0),
      })
      
      setIsLoggedIn(!!user) // Jika user ada, set true
    }

    updateCounts()
    window.addEventListener('storage', updateCounts)
    window.addEventListener('warungkopi-state-changed', updateCounts)
    return () => {
      window.removeEventListener('storage', updateCounts)
      window.removeEventListener('warungkopi-state-changed', updateCounts)
    }
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    navigate('/', { state: { focusSearch: true, searchQuery: searchValue.trim() } })
  }

  return (
    <header className="site-header" style={{ backgroundColor: '#ffffff' }}>
      <div className="customer-navbar__inner">
        
        {/* LOGO */}
        <Link to="/" className="brand-link brand-link--navbar">
          <img src="/Logo_Warkop_Nav.png" alt="Logo" style={{ height: '40px', width: 'auto' }} />
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
          <nav className="customer-navbar__nav">
            {navItems.map((item) => {
              if (item.type === 'dropdown') {
                return (
                  <details key={item.label} className="customer-navbar__menu-group">
                    <summary className="customer-navbar__pill customer-navbar__pill--menu">
                      <span>{item.label}</span>
                      <Icon name="chevron-down" />
                    </summary>
                    <div className="customer-navbar__dropdown">
                      {menuDropdownItems.map((opt) => (
                        <button key={opt.label} onClick={() => navigate('/', { state: { category: opt.category } })}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </details>
                )
              }

              if (item.type === 'button') {
                return (
                  <button key={item.label} className="customer-navbar__pill" onClick={() => navigate('/', { state: item.state })}>
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

          {/* LOGIKA LOGIN / PROFILE */}
          {isLoggedIn ? (
            // Jika SUDAH LOGIN: Tampilkan Icon User
            <Link to="/akun" className="customer-navbar__profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="user" />
            </Link>
          ) : (
            // Jika BELUM LOGIN: Tampilkan Tombol Login
            <Link 
              to="/login" 
              className="customer-navbar__pill customer-navbar__pill--active" 
              style={{ 
                backgroundColor: '#0070f3', 
                color: 'white', 
                padding: '8px 20px', 
                borderRadius: '8px',
                fontWeight: '600',
                marginLeft: '10px'
              }}
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </header>
  )
}

export default CustomerNavbar