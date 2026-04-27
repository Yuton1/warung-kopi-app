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
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m20 20-4.2-4.2m1.2-4.8a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
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

    navigate('/', {
      state: {
        focusMenu: true,
        category,
        searchQuery: '',
      },
    })
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const query = searchValue.trim()

    navigate('/', {
      state: {
        focusSearch: true,
        searchQuery: query,
      },
    })
  }

  return (
    <header className="site-header">
      <div className="customer-navbar__inner">
        <Link to="/" className="brand-link brand-link--navbar" aria-label="Warung Kopi home">
          <span className="brand-mark brand-mark--navbar brand-mark--logo" aria-hidden="true">
            <img className="brand-mark__image" src="/Logo_Warkop_Nav.png" alt="" />
          </span>
        </Link>
        <form className="customer-navbar__search" role="search" onSubmit={handleSearchSubmit}>
          <button type="submit" className="customer-navbar__search-button" aria-label="Cari menu">
            <span className="customer-navbar__search-icon" aria-hidden="true">
              <Icon name="search" />
            </span>
          </button>
          <input
            className="customer-navbar__search-input"
            type="search"
            placeholder="Cari menu"
            aria-label="Cari menu"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </form>

        <div className="customer-navbar__actions">
          <nav className="customer-navbar__nav" aria-label="Navigasi pengguna">
            {navItems.map((item) => {
              if (item.type === 'dropdown') {
                return (
                  <details key={item.label} className="customer-navbar__menu-group">
                    <summary className="customer-navbar__pill customer-navbar__pill--menu">
                      <span>{item.label}</span>
                      <span className="customer-navbar__pill-icon" aria-hidden="true">
                        <Icon name="chevron-down" />
                      </span>
                    </summary>
                    <div className="customer-navbar__dropdown" role="menu" aria-label="Kategori menu">
                      {menuDropdownItems.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          className="customer-navbar__dropdown-item"
                          onClick={(event) => handleMenuSelect(event, option.category)}
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
                    onClick={() => handleInternalNav(item.state)}
                  >
                    <span>{item.label}</span>
                    {item.badge && counts[item.badge] > 0 ? (
                      <span className="customer-navbar__badge" aria-label={`${counts[item.badge]} notifikasi`}>
                        {counts[item.badge]}
                      </span>
                    ) : null}
                  </button>
                )
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  state={item.state}
                  className={({ isActive }) =>
                    `customer-navbar__pill ${isActive ? 'customer-navbar__pill--active' : ''}`
                  }
                >
                  <span>{item.label}</span>
                  {item.badge && counts[item.badge] > 0 ? (
                    <span className="customer-navbar__badge" aria-label={`${counts[item.badge]} notifikasi`}>
                      {counts[item.badge]}
                    </span>
                  ) : null}
                </NavLink>
              )
            })}
          </nav>

          <Link to="/akun" className="customer-navbar__profile" aria-label="Profile">
            <span className="customer-navbar__profile-icon" aria-hidden="true">
              <Icon name="user" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default CustomerNavbar
