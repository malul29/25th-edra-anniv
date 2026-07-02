'use client';
import { useState, useEffect, useCallback } from 'react';

interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function RsvpSection() {
  const [attendance, setAttendance] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loadingWishes, setLoadingWishes] = useState(true);
  const [error, setError] = useState('');

  const fetchWishes = useCallback(async () => {
    try {
      setLoadingWishes(true);
      const res = await fetch('/api/rsvp');
      const data: Wish[] = await res.json();
      const withMsg = data
        .filter(g => g.message?.trim())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setWishes(withMsg);
    } catch {
      // silently fail
    } finally {
      setLoadingWishes(false);
    }
  }, []);

  useEffect(() => { fetchWishes(); }, [fetchWishes]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      attendance: (form.elements.namedItem('attendance') as HTMLSelectElement).value,
      companions: attendance === 'hadir'
        ? (form.elements.namedItem('companions') as HTMLSelectElement).value
        : '0',
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? 'Terjadi kesalahan. Coba lagi.');
      } else {
        setSubmitted(true);
        await fetchWishes();
      }
    } catch {
      setError('Terjadi kesalahan jaringan. Pastikan koneksi Anda aktif.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rsvp-section" id="rsvp">
      <div
        className="rsvp-bg"
        style={{ backgroundImage: "url('/assets/project-3.png')" }}
      />
      <div className="rsvp-overlay" />
      <div className="section-container rsvp-content">
        <p className="section-label">Konfirmasi</p>
        <h2 className="section-heading">Kehadiran</h2>

        {!submitted ? (
          <form className="rsvp-form" id="rsvp-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="guest-name">Nama Lengkap</label>
              <input
                type="text"
                id="guest-name"
                name="name"
                placeholder="Masukkan nama Anda"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="guest-phone">Nomor Telepon</label>
              <input
                type="tel"
                id="guest-phone"
                name="phone"
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="guest-attendance">Kehadiran</label>
              <select
                id="guest-attendance"
                name="attendance"
                required
                value={attendance}
                onChange={e => setAttendance(e.target.value)}
              >
                <option value="" disabled>— Pilih —</option>
                <option value="hadir">Hadir</option>
                <option value="tidak">Tidak Hadir</option>
              </select>
            </div>
            {attendance === 'hadir' && (
              <div className="form-group">
                <label htmlFor="guest-companions">Jumlah Pendamping</label>
                <select id="guest-companions" name="companions" defaultValue="0">
                  <option value="0">Tanpa Pendamping</option>
                  <option value="1">1 Orang</option>
                  <option value="2">2 Orang</option>
                  <option value="3">3 Orang</option>
                  <option value="4">4 Orang</option>
                  <option value="5">5 Orang</option>
                </select>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="guest-message">Ucapan (Opsional)</label>
              <textarea
                id="guest-message"
                name="message"
                rows={3}
                placeholder="Tulis ucapan Anda..."
              />
            </div>
            {error && (
              <p style={{ color: 'var(--crimson-lt)', fontSize: '0.8rem', textAlign: 'center', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              className="btn-glass btn-submit"
              id="btn-rsvp-submit"
              disabled={submitting}
            >
              <span>{submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}</span>
              {!submitting && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              )}
            </button>
          </form>
        ) : (
          <div className="rsvp-success" id="rsvp-success">
            <div className="success-icon">
              {/* Gothic cross / check */}
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>Terima Kasih</h3>
            <p>Konfirmasi kehadiran Anda telah kami terima.</p>
          </div>
        )}

        {/* Wishes Wall */}
        <div className="wishes-section" id="wishes-section">
          <div className="wishes-divider" />
          <p className="section-label" style={{ marginTop: 40 }}>Ucapan &amp; Doa</p>
          <h3 className="wishes-heading">Ucapan</h3>
          <div className="wishes-list" id="wishes-list">
            {loadingWishes ? (
              <p className="wishes-empty" style={{ animation: 'pulse 1.5s infinite' }}>
                Memuat ucapan...
              </p>
            ) : wishes.length === 0 ? (
              <p className="wishes-empty" id="wishes-empty">Belum ada ucapan.</p>
            ) : (
              wishes.map(w => {
                const date = new Date(w.timestamp).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric',
                });
                return (
                  <div className="wish-card" key={w.id}>
                    <div className="wish-card-header">
                      <span className="wish-card-name"
                        dangerouslySetInnerHTML={{ __html: escapeHtml(w.name) }}
                      />
                      <span className="wish-card-date">{date}</span>
                    </div>
                    <div
                      className="wish-card-message"
                      dangerouslySetInnerHTML={{ __html: `"${escapeHtml(w.message)}"` }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
