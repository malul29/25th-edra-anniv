'use client';
import { useEffect, useState, Fragment } from 'react';

const EVENT_DATE = new Date('2026-07-04T11:00:00+07:00').getTime();

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// Convert to Roman numerals for Gothic aesthetic
function toRoman(n: number): string {
  if (n === 0) return '—';
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      result += syms[i];
      n -= vals[i];
    }
  }
  return result;
}

export default function CountdownSection() {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    function update() {
      const diff = EVENT_DATE - Date.now();
      if (diff <= 0) { setIsOver(true); return; }
      setTime({
        days:  Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins:  Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs:  Math.floor((diff % (1000 * 60)) / 1000),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { val: time.days,  label: 'HARI',    numeric: pad(time.days) },
    { val: time.hours, label: 'JAM',   numeric: pad(time.hours) },
    { val: time.mins,  label: 'MENIT', numeric: pad(time.mins) },
    { val: time.secs,  label: 'DETIK',numeric: pad(time.secs) },
  ];

  return (
    <section className="countdown-section" id="countdown">
      <div className="section-container">
        <p className="section-label">Menuju Hari H</p>
        <h2 className="section-heading">Waktu Berjalan</h2>

        {isOver ? (
          <p style={{ textAlign:'center', fontStyle:'italic', color:'var(--fg-muted)', fontFamily:'var(--serif)', marginBottom:40 }}>
            Hari Jadi — Waktu telah tiba.
          </p>
        ) : (
          <div className="countdown-grid">
            {units.map((u, i) => (
              <Fragment key={u.label}>
                <div className="countdown-card">
                  <span className="countdown-value">{u.numeric}</span>
                  <span className="countdown-label">{u.label}</span>
                </div>
                {i < 3 && <div className="countdown-sep">·</div>}
              </Fragment>
            ))}
          </div>
        )}

        <div className="event-info-row">
          <div className="event-info-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Sabtu, 4 Juli 2026</span>
          </div>
          <div className="event-info-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>11:00 WIB — Selesai</span>
          </div>
        </div>
      </div>
    </section>
  );
}
