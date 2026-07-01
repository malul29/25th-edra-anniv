export default function DetailSection() {
  return (
    <section className="detail-section" id="detail">
      <div
        className="detail-bg"
        style={{ backgroundImage: "url('/assets/project-2.png')" }}
      />
      <div className="detail-overlay" />
      <div className="section-container detail-content">
        <p className="section-label">Undangan Acara</p>
        <h2 className="section-heading">
          25th Anniversary<br />EDRA Arsitek
        </h2>
        <p className="detail-desc">
          Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir dan merayakan 
          dua puluh lima tahun perjalanan kami dalam menciptakan karya arsitektur 
          yang menginspirasi dan abadi.
        </p>

        {/* Gothic divider with diamond */}
        <div className="detail-divider">
          <div className="divider-glyph" />
        </div>

        <div className="detail-venue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <div>
            <strong>Perum De Sanctuary Blok B/10</strong>
            <span>Jatimakmur, Kec. Pondok Gede</span>
            <span>Kota Bekasi, Jawa Barat</span>
          </div>
        </div>
      </div>
    </section>
  );
}
