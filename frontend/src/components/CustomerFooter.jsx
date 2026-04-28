import { Link } from 'react-router-dom'

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/', label: 'Menu' },
  { to: '/promo', label: 'Promo' },
  { to: '/pesanan', label: 'Pesanan' },
  { to: '/akun', label: 'Member' },
  { to: '/lokasi', label: 'Lokasi' },
]

const CustomerFooter = () => {
  return (
    <footer 
      className="w-full bg-[#301e16] text-white py-12 relative overflow-hidden" 
      style={{ 
        backgroundImage: `url('/Logoputihfooter.png')`, // Ganti dengan path logo putih Anda
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right center',
        backgroundSize: 'contain' 
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-10">
          
          {/* Brand Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="w-4 h-4 bg-[#301e16] rounded-full" />
              </div>
              <div className="leading-tight">
                <strong className="block text-xl uppercase tracking-tighter">Drinks</strong>
                <span className="text-sm font-light">Warung Kopi</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Warung Kopi untuk pemesanan menu, pre-order, group order, subscription, dan loyalty points dalam satu tempat yang hangat.
            </p>
            <address className="not-italic text-sm text-gray-400 mt-2">
              Jl. Rasa Kopi No. 17, Bandung, Jawa Barat <br />
              WhatsApp: <span className="text-white">+62 812-3456-7890</span>
            </address>
          </section>

          {/* Links Section */}
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

          {/* Operational Section */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Jam Operasional</h3>
            <p className="text-sm text-gray-300">Setiap hari 08.00 - 22.00</p>
            <p className="text-xs text-gray-400 italic">
              Pickup pre-order dan order langsung tersedia sepanjang jam buka.
            </p>
            <Link to="/lokasi" className="mt-4 inline-block bg-white text-[#301e16] px-6 py-2 rounded-full font-bold text-center hover:bg-gray-200 transition-all w-fit">
              Lihat lokasi
            </Link>
          </section>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 gap-4">
          <span>Menu, promo, akun, pesanan, dan lokasi tetap mudah dijangkau dari sini.</span>
          <span className="font-medium">© 2026 Warung Kopi. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default CustomerFooter;