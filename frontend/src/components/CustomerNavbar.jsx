import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', end: true, label: 'Home' },
  { to: '/menu', label: 'Menu', state: { focusMenu: true } },
  { to: '/pesanan', label: 'Pesanan', badge: 2 },
  { to: '/member', label: 'Member' },
  { to: '/keranjang', label: 'Keranjang', state: { scrollToCart: true } },
];

const Icon = ({ name, className = "w-6 h-6" }) => {
  switch (name) {
    case 'search':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      );
    case 'user':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.3-8 5v1h16v-1c0-2.7-3.6-5-8-5Z" />
        </svg>
      );
    case 'logo':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#886245" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      );
    default:
      return null;
  }
};

const CustomerNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FCF8F5] py-3 px-4 md:px-8 shadow-sm font-['Fredoka']">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Warung Kopi home">
          <Icon name="logo" className="w-8 h-8 md:w-10 md:h-10 text-[#886245]" />
          <div className="flex flex-col leading-none text-[#886245]">
            <span className="text-xl md:text-2xl font-bold tracking-tight">Drinks</span>
            <span className="text-xs md:text-sm font-medium">Warung Kopi</span>
          </div>
        </Link>

        {/* SEARCH BAR SECTION */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
              <Icon name="search" className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Cari Menu" 
              className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-full focus:ring-[#886245] focus:border-[#886245] block pl-12 p-3 outline-none transition-all shadow-sm font-medium"
            />
          </div>
        </div>

        {/* NAVIGATION PILLS SECTION (Responsif: Bisa di-scroll menyamping di HP) */}
        <nav className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0" aria-label="Navigasi pengguna">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              state={item.state}
              className={({ isActive }) =>
                `relative flex items-center justify-center px-5 py-2 md:px-6 md:py-2.5 rounded-full font-medium text-sm md:text-base whitespace-nowrap transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#886245] text-white shadow-md' 
                    : 'bg-[#FFF0E5] text-[#886245] hover:bg-[#886245] hover:text-white'
                }`
              }
            >
              {item.label}
              
              {/* BADGE NOTIFIKASI (Misal: 2 Pesanan) */}
              {item.badge && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B00] text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full border-2 border-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* PROFILE/ACCOUNT BUTTON */}
        <Link 
          to="/akun" 
          className="hidden md:flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#886245] text-[#FFF0E5] hover:opacity-85 transition-opacity flex-shrink-0 shadow-md"
          aria-label="Profil Akun"
        >
          <Icon name="user" className="w-6 h-6" />
        </Link>

      </div>
    </header>
  );
};

export default CustomerNavbar;