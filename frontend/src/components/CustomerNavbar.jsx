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
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <header className="site-header sticky top-0 z-50 w-full bg-[#FCF8F5] py-4 px-4 md:px-8 shadow-sm">
      {/* PERBAIKAN 1: Container utama disejajarkan rata ujung ke ujung (justify-between) */}
      <div className="customer-navbar__inner max-w-[1400px] mx-auto flex items-center justify-between gap-6 md:gap-8">
        
        {/* PERBAIKAN 2: Wrapper logo diberi flex-shrink-0 agar tidak mengecil, lalu tag img diberi tinggi mutlak (h-12) */}
        <Link to="/" className="brand-link brand-link--navbar flex-shrink-0" aria-label="Warung Kopi home">
          <span className="brand-mark brand-mark--navbar brand-mark--logo" aria-hidden="true">
            <img className="brand-mark__image h-10 md:h-14 w-auto object-contain block" src="/Logo_Warkop_Nav.png" alt="Logo Warung Kopi" />
          </span>
        </Link>

        {/* PERBAIKAN 3: Form diberi flex-1 agar merentang penuh, dan max-w-2xl agar ada batas lebarnya */}
        <form className="customer-navbar__search flex-1 max-w-2xl relative flex items-center" role="search" onSubmit={handleSearchSubmit}>
          <button type="submit" className="customer-navbar__search-button absolute left-4 text-gray-400 hover:text-[#886245] transition-colors" aria-label="Cari menu">
            <span className="customer-navbar__search-icon w-5 h-5 block" aria-hidden="true">
              <Icon name="search" />
            </span>
          </button>
          {/* Input diberi w-full dan padding kiri (pl-12) agar tidak menabrak icon */}
          <input
            className="customer-navbar__search-input w-full bg-white border border-gray-200 rounded-full pl-12 pr-4 py-2.5 md:py-3 focus:ring-[#886245] focus:border-[#886245] outline-none text-gray-700 font-medium transition-all shadow-sm"
            type="search"
            placeholder="Cari menu"
            aria-label="Cari menu"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </form>

        {/* PERBAIKAN 4: Kelompok tombol & profil ditaruh dalam flex container dengan gap */}
        <div className="customer-navbar__actions flex items-center gap-3 shrink-0">
          <nav className="customer-navbar__nav flex items-center gap-2" aria-label="Navigasi pengguna">
            {navItems.map((item) => {
              
              // DROPDOWN MENU
              if (item.type === 'dropdown') {
                return (
                  <details key={item.label} className="customer-navbar__menu-group relative">
                    <summary className="customer-navbar__pill customer-navbar__pill--menu cursor-pointer flex items-center gap-1 list-none px-5 py-2.5 rounded-full font-semibold text-[#886245] bg-[#FFF0E5] hover:bg-[#886245] hover:text-white transition-all">
                      <span>{item.label}</span>
                      <span className="customer-navbar__pill-icon w-4 h-4 block" aria-hidden="true">
                        <Icon name="chevron-down" />
                      </span>
                    </summary>
                    <div className="customer-navbar__dropdown absolute top-full mt-2 w-40 bg-white shadow-lg rounded-xl overflow-hidden flex flex-col z-10" role="menu" aria-label="Kategori menu">
                      {menuDropdownItems.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          className="customer-navbar__dropdown-item px-4 py-3 text-left hover:bg-[#FFF0E5] text-gray-700 hover:text-[#886245] transition-colors"
                          onClick={(event) => handleMenuSelect(event, option.category)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </details>
                )
              }

              // BUTTON BIASA (Keranjang dll)
              if (item.type === 'button') {
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="customer-navbar__pill customer-navbar__pill--button relative px-5 py-2.5 rounded-full font-semibold text-[#886245] bg-[#FFF0E5] hover:bg-[#886245] hover:text-white transition-all"
                    onClick={() => handleInternalNav(item.state)}
                  >
                    <span>{item.label}</span>
                    {item.badge && counts[item.badge] > 0 ? (
                      <span className="customer-navbar__badge absolute -top-1.5 -right-1.5 bg-[#FF6B00] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FCF8F5]" aria-label={`${counts[item.badge]} notifikasi`}>
                        {counts[item.badge]}
                      </span>
                    ) : null}
                  </button>
                )
              }

              // LINK (Home, Pesanan, dll)
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  state={item.state}
                  className={({ isActive }) =>
                    `customer-navbar__pill relative px-5 py-2.5 rounded-full font-semibold transition-all ${
                      isActive 
                      ? 'customer-navbar__pill--active bg-[#886245] text-white shadow-md' 
                      : 'bg-[#FFF0E5] text-[#886245] hover:bg-[#886245] hover:text-white'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.badge && counts[item.badge] > 0 ? (
                    <span className="customer-navbar__badge absolute -top-1.5 -right-1.5 bg-[#FF6B00] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FCF8F5]" aria-label={`${counts[item.badge]} notifikasi`}>
                      {counts[item.badge]}
                    </span>
                  ) : null}
                </NavLink>
              )
            })}
          </nav>

          {/* PROFILE ICON */}
          <Link to="/akun" className="customer-navbar__profile flex items-center justify-center w-11 h-11 rounded-full bg-[#886245] text-white hover:opacity-85 transition-opacity ml-2 shrink-0 shadow-md" aria-label="Profile">
            <span className="customer-navbar__profile-icon w-6 h-6" aria-hidden="true">
              <Icon name="user" />
            </span>
          </Link>
        </div>

      </div>
    </header>
  )
}

export default CustomerNavbar