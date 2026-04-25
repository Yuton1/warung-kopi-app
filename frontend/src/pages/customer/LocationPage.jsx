import { Link } from 'react-router-dom'

const locationData = {
  name: 'Warung Kopi DrinKs',
  address: 'Jl. Rasa Kopi No. 17, Bandung, Jawa Barat',
  hours: 'Setiap hari 08.00 - 22.00',
  phone: '+62 812-3456-7890',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Kopi+Bandung',
  whatsappUrl: 'https://wa.me/6281234567890',
}

const LocationPage = () => {
  return (
    <div className="screen-shell">
      <section className="screen-hero screen-hero--split">
        <div>
          <span className="eyebrow">Lokasi / Kontak Kami</span>
          <h1>Trust builder yang kuat untuk user baru.</h1>
          <p>
            Menampilkan alamat fisik, jam operasional, tautan maps, dan nomor kontak agar pelanggan merasa aman
            sebelum checkout.
          </p>
        </div>

        <div className="screen-hero__card">
          <span className="eyebrow">Kontak cepat</span>
          <strong>{locationData.phone}</strong>
          <p>{locationData.hours}</p>
          <a href={locationData.whatsappUrl} className="btn btn-secondary" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </section>

      <section className="contact-grid">
        <article className="surface-card">
          <div className="section-head section-head--tight">
            <div>
              <span className="eyebrow">Alamat Warung</span>
              <h2>{locationData.name}</h2>
            </div>
          </div>

          <div className="contact-stack">
            <div className="contact-line">
              <span>Alamat</span>
              <strong>{locationData.address}</strong>
            </div>
            <div className="contact-line">
              <span>Jam buka</span>
              <strong>{locationData.hours}</strong>
            </div>
            <div className="contact-line">
              <span>Telepon</span>
              <strong>{locationData.phone}</strong>
            </div>
          </div>

          <div className="promo-card__actions">
            <a href={locationData.mapsUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
              Buka Google Maps
            </a>
            <Link to="/" className="btn btn-secondary">
              Lihat menu
            </Link>
          </div>
        </article>

        <article className="surface-card surface-card--map">
          <div className="map-placeholder">
            <span className="eyebrow">Akses lokasi</span>
            <h2>Warung Kopi mudah dicari</h2>
            <p>Gunakan maps untuk navigasi langsung atau hubungi CS jika butuh arahan pickup.</p>
            <div className="map-placeholder__badge">Open daily</div>
          </div>
        </article>
      </section>

      <section className="metrics-row">
        <article className="metric-card">
          <span>Alamat fisik</span>
          <strong>Ada</strong>
        </article>
        <article className="metric-card">
          <span>WhatsApp</span>
          <strong>Aktif</strong>
        </article>
        <article className="metric-card">
          <span>Maps</span>
          <strong>Siap dibuka</strong>
        </article>
      </section>
    </div>
  )
}

export default LocationPage

