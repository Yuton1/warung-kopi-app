import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS, readStoredValue } from '../data/customerStorage'

const navItems = [
  { to: '/', end: true, label: 'Home', type: 'link' },
  { label: 'Menu', type: 'dropdown' },
  { to: '/pesanan', label: 'Pesanan', type: 'link', badge: 'orders' },
  { to: '/akun', label: 'Member', type: 'link' },
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    case 'chevron-down':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px' }}>
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
  const [searchValue, setSearchValue] = useState('')
  const [counts, setCounts] = useState({ orders: 0, cart: 0 })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
    return () => {
      window.removeEventListener('storage', updateState)
      window.removeEventListener('warungkopi-state-changed', updateState)
    }
  }, [])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    navigate('/', { state: { focusSearch: true, searchQuery: searchValue.trim() } })
  }

  return (
    <header className="site-header" style={{ backgroundColor: '#ffffff' }}>
      <div className="customer-navbar__inner">
        <Link to="/" className="brand-link brand-link--navbar">
          <img src="/Logo_Warkop_Nav.png" alt="Logo" style={{ height: '40px', width: 'auto' }} />
        </Link>

        <form className="customer-navbar__search" onSubmit={handleSearchSubmit}>
          <div className="customer-navbar__search-container" style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8', pointerEvents: 'none' }}>
              <Icon name="search" />
            </span>
            <input
              className="customer-navbar__search-input"
              type="search"
              placeholder="Cari menu..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              style={{ width: '100%', paddingLeft: '45px' }}
            />
          </div>
        </form>

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
                      {menuDropdownItems.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          className="customer-navbar__dropdown-item"
                          onClick={() => navigate('/', { state: { category: option.category } })}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </details>
                )
              }

              if (item.type === 'button') {
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="customer-navbar__pill customer-navbar__pill--button"
                    onClick={() => navigate('/', { state: item.state })}
                  >
                    <span>{item.label}</span>
                    {item.badge && counts[item.badge] > 0 ? <span className="customer-navbar__badge">{counts[item.badge]}</span> : null}
                  </button>
                )
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `customer-navbar__pill ${isActive ? 'customer-navbar__pill--active' : ''}`}
                >
                  <span>{item.label}</span>
                  {item.badge && counts[item.badge] > 0 ? <span className="customer-navbar__badge">{counts[item.badge]}</span> : null}
                </NavLink>
              )
            })}
          </nav>

          {isLoggedIn ? (
            <Link to="/akun" className="customer-navbar__profile" aria-label="Buka profil">
              <Icon name="user" />
            </Link>
          ) : (
            <Link to="/login" className="customer-navbar__pill customer-navbar__pill--active">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default CustomerNavbar
