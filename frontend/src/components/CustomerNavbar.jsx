import { Link, NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/', end: true, label: 'Home', icon: 'home', state: null, type: 'link' },
  { label: 'Menu', icon: 'menu', state: { focusMenu: true }, type: 'button' },
  { to: '/pesanan', label: 'Pesanan', icon: 'clock', state: null, type: 'link' },
  { to: '/akun', label: 'Member', icon: 'user', state: null, type: 'link' },
  { label: 'Keranjang', icon: 'cart', state: { scrollToCart: true }, type: 'button' },
]

const Icon = ({ name }) => {
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11.5 12 4l8 7.5v8.5a1 1 0 0 1-1 1h-5.5v-6h-3v6H5a1 1 0 0 1-1-1z" />
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
  const navigate = useNavigate()

  const handleInternalNav = (state) => {
    navigate('/', { state })
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand-link brand-link--navbar" aria-label="Warung Kopi home">
          {/* GAMBAR: Logo Navbar Kiri */}
          <span className="brand-mark brand-mark--navbar" aria-hidden="true">
            <span className="brand-mark__dot" />
          </span>
          <span className="brand-copy brand-copy--navbar">
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

        <nav className="nav-pills" aria-label="Navigasi pengguna">
          {navItems.map((item) => {
            if (item.type === 'button') {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="nav-pill nav-pill--button"
                  onClick={() => handleInternalNav(item.state)}
                >
                  <span className="nav-pill__icon" aria-hidden="true">
                    <Icon name={item.icon} />
                  </span>
                  <span className="nav-pill__text">
                    <strong>{item.label}</strong>
                  </span>
                </button>
              )
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                state={item.state}
                className={({ isActive }) => `nav-pill ${isActive ? 'is-active' : ''}`}
              >
                <span className="nav-pill__icon" aria-hidden="true">
                  <Icon name={item.icon} />
                </span>
                <span className="nav-pill__text">
                  <strong>{item.label}</strong>
                </span>
              </NavLink>
            )
          })}
        </nav>

        <Link to="/akun" className="account-cta" aria-label="Login">
          <span className="account-cta__icon" aria-hidden="true">
            <Icon name="user" />
          </span>
        </Link>
      </div>
    </header>
  )
}

export default CustomerNavbar
