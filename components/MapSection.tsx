export default function MapSection() {
  const mapsKey = process.env.NEXT_PUBLIC_MAPS_KEY;
  const mapSrc = mapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=-6.276339,106.937945&zoom=17`
    : `https://maps.google.com/maps?q=-6.276339,106.937945&z=17&output=embed`;

  return (
    <section className="map-section" id="map">
      <div className="section-container">
        <p className="section-label">Lokasi</p>
        <h2 className="section-heading">Acara</h2>
        <div className="map-wrapper">
          <iframe
            src={mapSrc}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            id="map-iframe"
            title="Lokasi Acara"
          />
        </div>
        <a
          href="https://maps.app.goo.gl/gfqk1uZQVE5Vie2f6"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glass"
          id="btn-open-maps"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>Buka di Google Maps</span>
        </a>
      </div>
    </section>
  );
}
