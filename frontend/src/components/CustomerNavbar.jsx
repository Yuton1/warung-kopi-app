import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS, readStoredValue } from '../data/customerStorage'

const navItems = [
  { to: '/', end: true, label: 'Home', state: null, type: 'link' },
  { label: 'Menu', type: 'dropdown' },
  { to: '/pesanan', label: 'Pesanan', state: null, type: 'link', badge: 'orders' },
  { to: '/akun', label: 'Member', state: null, type: 'link' },
  { label: 'Keranjang', state: { scrollToCart: true }, type: 'button', badge: 'cart' },
]

const menuDropdownItems = [
  { label: 'Minuman', category: 'Minuman' },
  { label: 'Makanan', category: 'Makanan' },
  { label: 'Cemilan', category: 'Makanan' },
]

const Icon = ({ name }) => {
  switch (name) {
    case 'search':
      return (
        // Icon Search yang lebih modern dan ramping
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )
    case 'chevron-down':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      )
    case 'user':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const [searchValue, setSearchValue] = useState('')
  const [counts, setCounts] = useState({ orders: 0, cart: 0 })

  useEffect(() => {
    const updateCounts = () => {
      const cart = readStoredValue(STORAGE_KEYS.cart, [])
      const history = readStoredValue(STORAGE_KEYS.history, [])
      const preOrder = readStoredValue(STORAGE_KEYS.preorder, null)

      setCounts({
        cart: Array.isArray(cart) ? cart.reduce((total, item) => total + (Number(item.qty) || 0), 0) : 0,
        orders: (Array.isArray(history) ? history.length : 0) + (preOrder ? 1 : 0),
      })
    }

    updateCounts()
    window.addEventListener('storage', updateCounts)
    window.addEventListener('warungkopi-state-changed', updateCounts)

    return () => {
      window.removeEventListener('storage', updateCounts)
      window.removeEventListener('warungkopi-state-changed', updateCounts)
    }
  }, [])

  const handleInternalNav = (state) => {
    navigate('/', { state })
  }

  const handleMenuSelect = (event, category) => {
    event.currentTarget.closest('details')?.removeAttribute('open')
    navigate('/', { state: { focusMenu: true, category, searchQuery: '' } })
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const query = searchValue.trim()
    navigate('/', { state: { focusSearch: true, searchQuery: query } })
  }

  return (
    <header className="site-header">
      <div className="customer-navbar__inner" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '0 20px' }}>
        
        {/* LOGO SECTION */}
        <Link 
          to="/" 
          className="brand-link brand-link--navbar" 
          style={{ width: 'auto', height: '50px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <span className="brand-mark brand-mark--navbar brand-mark--logo" style={{ width: 'auto', height: '100%' }}>
            <img 
              className="brand-mark__image" 
              src="/Logo_Warkop_Nav.png" 
              alt="Logo" 
              style={{ height: '100%', width: 'auto', objectFit: 'contain' }} 
            />
          </span>
        </Link>

        {/* SEARCH SECTION - Dibuat melebar dengan flex: 1 */}
        <form 
          className="customer-navbar__search" 
          onSubmit={handleSearchSubmit}
          style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            position: 'relative',
            maxWidth: '600px' // Kamu bisa sesuaikan batas maksimal lebarnya di sini
          }}
        >
          <button 
            type="submit" 
            style={{ 
              position: 'absolute', 
              left: '15px', 
              background: 'none', 
              border: 'none', 
              width: '20px', 
              height: '20px',
              color: '#886245',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Icon name="search" />
          </button>
          <input
            className="customer-navbar__search-input"
            type="search"
            placeholder="Cari menu..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 15px 10px 45px', 
              borderRadius: '25px', 
              border: '1px solid #e2e8f0',
              outline: 'none'
            }}
          />
        </form>

        {/* ACTIONS SECTION */}
        <div className="customer-navbar__actions" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <nav className="customer-navbar__nav" style={{ display: 'flex', gap: '10px' }}>
            {navItems.map((item) => {
              if (item.type === 'dropdown') {
                return (
                  <details key={item.label} className="customer-navbar__menu-group">
                    <summary className="customer-navbar__pill customer-navbar__pill--menu">
                      <span>{item.label}</span>
                      <span className="customer-navbar__pill-icon"><Icon name="chevron-down" /></span>
                    </summary>
                    <div className="customer-navbar__dropdown">
                      {menuDropdownItems.map((option) => (
                        <button key={option.label} onClick={(e) => handleMenuSelect(e, option.category)}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </details>
                )
              }

              if (item.type === 'button') {
                return (
                  <button key={item.label} className="customer-navbar__pill customer-navbar__pill--button" onClick={() => handleInternalNav(item.state)}>
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

          <Link to="/akun" className="customer-navbar__profile" style={{ marginLeft: '15px' }}>
            <span className="customer-navbar__profile-icon"><Icon name="user" /></span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default CustomerNavbar