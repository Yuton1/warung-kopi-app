import { Link, NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', end: true, label: 'Home', state: null, type: 'link' },
  { label: 'Menu', state: { focusMenu: true }, type: 'button' },
  { to: '/pesanan', label: 'Pesanan', state: null, type: 'link', badge: 2 },
  { to: '/member', label: 'Member', state: null, type: 'link' },
  { label: 'Keranjang', state: { scrollToCart: true }, type: 'button' },
];

const Icon = ({ name, className = "w-5 h-5" }) => {
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
  const navigate = useNavigate();

  const handleInternalNav = (state) => {
    navigate('/', { state });
  };

  // Variabel styling Tailwind agar penulisan class tidak panjang dan berulang
  const pillBaseStyle = "relative px-5 py-2 md:px-6 md:py-2.5 rounded-full font-semibold text-sm md:text-base whitespace-nowrap transition-all duration-300";
  const inactiveStyle = "bg-[#FFF0E5] text-[#886245] hover:bg-[#886245] hover:text-white";
  const activeStyle = "bg-[#886245] text-white shadow-md";

  return (
    // bg-[#FCF8F5] disesuaikan dengan warna background pada gambar desain
    <header className="sticky top-0 z-50 w-full bg-[#FCF8F5] py-4 px-4 md:px-8 font-['Fredoka'] shadow-sm">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Warung Kopi home">
          <Icon name="logo" className="w-10 h-10 text-[#886245]" />
          <div className="flex flex-col leading-tight text-[#886245]">
            <span className="text-xl md:text-2xl font-bold tracking-tight">Drinks</span>
            <span className="text-xs md:text-sm font-medium">Warung Kopi</span>
          </div>
        </Link>

        {/* SEARCH BAR SECTION (Berbentuk input agar bisa digunakan) */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Icon name="search" />
          </div>
          <input 
            type="text" 
            placeholder="Cari Menu" 
            className="w-full bg-white border border-gray-200 rounded-full px-12 py-2.5 focus:ring-[#886245] focus:border-[#886245] outline-none text-gray-700 font-medium transition-all shadow-sm"
          />
        </div>

        {/* NAVIGATION PILLS SECTION */}
        <nav className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0" aria-label="Navigasi pengguna">
          {navItems.map((item) => {
            // Render sebagai Button jika tipe item adalah 'button'
            if (item.type === 'button') {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`${pillBaseStyle} ${inactiveStyle}`}
                  onClick={() => handleInternalNav(item.state)}
                >
                  {item.label}
                </button>
              );
            }

            // Render sebagai NavLink jika tipe item adalah 'link'
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                state={item.state}
                className={({ isActive }) => `${pillBaseStyle} ${isActive ? activeStyle : inactiveStyle}`}
              >
                {item.label}
                
                {/* BADGE NOTIFIKASI ORANYE */}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B00] text-white text-[11px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full border-2 border-[#FCF8F5]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* PROFILE ICON (Dipindah ke paling kanan menggunakan justify-between) */}
        <Link 
          to="/akun" 
          className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#886245] text-white hover:opacity-85 transition-opacity flex-shrink-0 shadow-md" 
          aria-label="Login / Akun"
        >
          <Icon name="user" className="w-6 h-6" />
        </Link>

      </div>
    </header>
  );
};

export default CustomerNavbar;