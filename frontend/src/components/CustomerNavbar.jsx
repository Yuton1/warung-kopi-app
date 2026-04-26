import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/', end: true, label: 'Home', state: null, type: 'link' },
  { label: 'Menu', state: { focusMenu: true }, type: 'button' },
  { to: '/pesanan', label: 'Pesanan', state: null, type: 'link' },
  { to: '/akun', label: 'Member', state: null, type: 'link' },
  { label: 'Keranjang', state: { scrollToCart: true }, type: 'button' },
]

const Icon = ({ name }) => {
  switch (name) {
    case 'search':
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m20 20-4.2-4.2m1.2-4.8a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
        </svg>
      )
  }
}

const CustomerNavbar = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  const handleInternalNav = (state) => {
    navigate('/', { state })
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
          <span className="brand-mark brand-mark--navbar brand-mark--placeholder" aria-hidden="true">
            <span className="brand-mark__placeholder">Logo</span>
          </span>
          <span className="brand-copy brand-copy--navbar">
            <strong>Drinks</strong>
            <span>Warung Kopi</span>
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

        <nav className="customer-navbar__nav" aria-label="Navigasi pengguna">
          {navItems.map((item) => {
            if (item.type === 'button') {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="customer-navbar__pill customer-navbar__pill--button"
                  onClick={() => handleInternalNav(item.state)}
                >
                  {item.label}
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
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default CustomerNavbar
