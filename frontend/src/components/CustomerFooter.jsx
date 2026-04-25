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
    <footer className="site-footer">
      <div className="site-footer__inner">
        <section className="site-footer__brand">
          <div className="footer-brand">
            {/* GAMBAR: Logo Cafe Footer */}
            <span className="footer-brand__mark" aria-hidden="true">
              <span className="footer-brand__dot" />
            </span>
            <div>
              <strong>Drinks</strong>
              <span>Warung Kopi</span>
            </div>
          </div>
          <p>
            Warung Kopi untuk pemesanan menu, pre-order, group order, subscription, dan loyalty points dalam satu
            tempat yang hangat.
          </p>
          <address>
            Jl. Rasa Kopi No. 17, Bandung, Jawa Barat
            <br />
            WhatsApp: +62 812-3456-7890
          </address>
        </section>

        <section className="site-footer__links">
          <h3>Footer Menu</h3>
          <nav aria-label="Footer navigation">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                state={item.label === 'Menu' ? { focusMenu: true } : undefined}
                className="footer-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        <section className="site-footer__contact">
          <h3>Jam Operasional</h3>
          <p>Setiap hari 08.00 - 22.00</p>
          <p>Pickup pre-order dan order langsung tersedia sepanjang jam buka.</p>
          <Link to="/lokasi" className="btn btn-secondary">
            Lihat kontak
          </Link>
        </section>
      </div>

      <div className="site-footer__bottom">
        <span>Menu, promo, akun, pesanan, dan lokasi tetap mudah dijangkau dari sini.</span>
        <span>© 2026 Warung Kopi</span>
      </div>
    </footer>
  )
}

export default CustomerFooter
