import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', end: true, label: 'Home', icon: 'home' },
  { to: '/', label: 'Menu', icon: 'menu', state: { focusMenu: true } },
  { to: '/pesanan', label: 'Pesanan', icon: 'clock' },
  { to: '/akun', label: 'Member', icon: 'user' },
  { to: '/', label: 'Keranjang', icon: 'cart', state: { scrollToCart: true } },
]

const Icon = ({ name }) => {
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11.5 12 4l8 7.5v8.5a1 1 0 0 1-1 1h-5.5v-6h-3v6H5a1 1 0 0 1-1-1z" />
        </svg>
      )
    case 'tag':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 10.5 13.5 4H6a2 2 0 0 0-2 2v7.5L10.5 20a2 2 0 0 0 2.8 0L20 13.3a2 2 0 0 0 0-2.8ZM8.5 8A1.5 1.5 0 1 1 8.5 5A1.5 1.5 0 0 1 8.5 8Z" />
        </svg>
      )
    case 'menu':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
        </svg>
      )
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 9 9A9 9 0 0 0 12 3Zm1 4v5.1l4 2.4-1 1.7-5-3V7Z" />
        </svg>
      )
    case 'user':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.3-8 5v1h16v-1c0-2.7-3.6-5-8-5Z" />
        </svg>
      )
    case 'map':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2a7 7 0 0 0-7 7c0 4.6 7 13 7 13s7-8.4 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
        </svg>
      )
    case 'cart':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM6.2 6l.3 2h12.9a1 1 0 0 1 1 1.2l-1.1 5.5a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-1.9-1.5L4.7 4H2V2h4a1 1 0 0 1 1 .8L7.4 6Z" />
        </svg>
      )
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
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand-link" aria-label="Warung Kopi home">
          {/* GAMBAR: Logo Navbar Kiri */}
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark__dot" />
          </span>
          <span className="brand-copy">
            <strong>Drinks</strong>
            <span>Warung Kopi</span>
          </span>
        </Link>

        <Link to="/" state={{ focusSearch: true }} className="nav-searchbar" aria-label="Cari menu">
          <span className="nav-searchbar__icon" aria-hidden="true">
            <Icon name="search" />
          </span>
          <span>Cari Menu</span>
        </Link>

        <div className="site-header__actions">
          <nav className="nav-pills" aria-label="Navigasi pengguna">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-pill ${isActive ? 'is-active' : ''}`}
                state={item.state}
              >
                <span className="nav-pill__icon" aria-hidden="true">
                  <Icon name={item.icon} />
                </span>
                <span className="nav-pill__text">
                  <strong>{item.label}</strong>
                </span>
              </NavLink>
            ))}
          </nav>

          <Link to="/akun" className="account-cta">
            <span className="account-cta__icon" aria-hidden="true">
              <Icon name="user" />
            </span>
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default CustomerNavbar
