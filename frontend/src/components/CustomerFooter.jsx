import { Link } from 'react-router-dom'

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/', label: 'Menu' },
  { to: '/promo', label: 'Promo' },
  { to: '/pesanan', label: 'Pesanan' },
  { to: '/member', label: 'Member' },
  { to: '/lokasi', label: 'Lokasi' },
]

const CustomerFooter = () => {
  return (
    <footer
      className="w-full bg-[#301e16] text-white py-12 relative overflow-hidden font-['Fredoka']"
      style={{ backgroundImage: 'none' }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-10">
          <section className="flex flex-col gap-5">
            {/* LOGO BARU MENGGUNAKAN IMAGE */}
            <Link to="/" className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
              <img 
                src="/Logo Putih.png" 
                alt="Logo Warung Kopi" 
                className="h-10 w-auto object-contain" 
              />
            </Link>
            
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Warung Kopi untuk pemesanan menu, pre-order, group order, subscription, dan loyalty points dalam satu tempat yang hangat.
            </p>
            <address className="not-italic text-sm text-gray-400 mt-2">
              Jl. Raya Tlogomas No. 246, Malang, Jawa Timur <br />
              WhatsApp: <span className="text-white">+62 812-3456-7890</span>
            </address>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-6">Footer Menu</h3>
            <nav className="grid grid-cols-2 gap-y-3">
              {footerLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  state={item.label === 'Menu' ? { focusMenu: true } : undefined}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Jam Operasional</h3>
            <p className="text-sm text-gray-300">Setiap hari 08.00 - 22.00</p>
            <p className="text-xs text-gray-400 italic">
              Pickup pre-order dan order langsung tersedia sepanjang jam buka.
            </p>
            <Link
              to="/lokasi"
              className="mt-4 inline-block bg-[#ff7700] !text-[#ffffff] px-6 py-2 rounded-full font-bold text-center hover:bg-[#ce6000] transition-all w-fit"
            >
              Lihat lokasi
            </Link>
          </section>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 gap-4">
          <span>Menu, promo, akun, pesanan, dan lokasi tetap mudah dijangkau dari sini.</span>
          <span className="font-medium">© 2026 Warung Kopi. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default CustomerFooter