'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Guest {
  id: string;
  name: string;
  phone: string;
  attendance: 'hadir' | 'tidak';
  companions: number;
  message: string;
  timestamp: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/guests');
      if (res.status === 401) {
        setAuthError(true);
        return;
      }
      const data = await res.json();
      setGuests(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  useEffect(() => {
    if (authError) router.push('/admin/login');
  }, [authError, router]);

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus data "${name}"?`)) return;
    await fetch(`/api/admin/guests?id=${id}`, { method: 'DELETE' });
    setGuests(prev => prev.filter(g => g.id !== id));
  }

  // ── Export CSV ──────────────────────────────
  function exportCSV() {
    window.open('/api/admin/export?format=csv', '_blank');
  }

  // ── Export Excel ────────────────────────────
  function exportExcel() {
    window.open('/api/admin/export?format=excel', '_blank');
  }

  // ── Export PDF ──────────────────────────────
  function exportPDF() {
    const doc = new jsPDF({ orientation: 'landscape' });
    const date = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    // Header
    doc.setFontSize(16);
    doc.setTextColor(201, 169, 110);
    doc.text('EDRA ARSITEK — 25TH ANNIVERSARY', 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Rekap Data Tamu  ·  Dicetak: ${date}`, 14, 22);

    // Stats summary
    const hadir = guests.filter(g => g.attendance === 'hadir').length;
    const tidak = guests.filter(g => g.attendance === 'tidak').length;
    const companions = guests.reduce((s, g) => s + (g.companions || 0), 0);
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text(`Total RSVP: ${guests.length}   Hadir: ${hadir}   Tidak: ${tidak}   Total Tamu + Pendamping: ${hadir + companions}`, 14, 30);

    autoTable(doc, {
      startY: 36,
      head: [['Waktu', 'Nama', 'Telepon', 'Kehadiran', 'Pendamping', 'Ucapan']],
      body: guests.map(g => [
        new Date(g.timestamp).toLocaleString('id-ID'),
        g.name,
        g.phone,
        g.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir',
        String(g.companions),
        g.message || '-',
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [201, 169, 110], textColor: 15 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 40 },
        2: { cellWidth: 32 },
        3: { cellWidth: 24 },
        4: { cellWidth: 22 },
        5: { cellWidth: 'auto' },
      },
    });

    const fname = `Rekap_Tamu_Edra_Anniv_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fname);
  }

  // ── Stats ────────────────────────────────────
  const hadir = guests.filter(g => g.attendance === 'hadir').length;
  const tidak = guests.filter(g => g.attendance === 'tidak').length;
  const companions = guests.reduce((s, g) => s + (g.companions || 0), 0);

  if (authError) return null;

  return (
    <div className="admin-page">
      {/* Top bar */}
      <header className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src="/assets/edra-logo.png"
            alt="Edra"
            width={36}
            height={36}
            className="admin-topbar-logo"
            style={{ width: 36, height: 'auto' }}
          />
          <span className="admin-topbar-title">Admin Panel</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a
            href="/"
            style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.1em' }}
          >
            ← Undangan
          </a>
          <button className="btn-logout" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Keluar
          </button>
        </div>
      </header>

      <main className="admin-content">
        {/* Stats */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <span className="stat-value">{guests.length}</span>
            <span className="stat-label">Total RSVP</span>
          </div>
          <div className="stat-card">
            <span className="stat-value" style={{ color: '#66bb6a' }}>{hadir}</span>
            <span className="stat-label">Hadir</span>
          </div>
          <div className="stat-card">
            <span className="stat-value" style={{ color: '#ef5350' }}>{tidak}</span>
            <span className="stat-label">Tidak Hadir</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{hadir + companions}</span>
            <span className="stat-label">Total + Pendamping</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <span className="admin-toolbar-title">
            Daftar Tamu ({guests.length})
          </span>
          <div className="export-group">
            <button className="btn-export csv" onClick={exportCSV} title="Export CSV">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              CSV
            </button>
            <button className="btn-export excel" onClick={exportExcel} title="Export Excel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Excel
            </button>
            <button className="btn-export pdf" onClick={exportPDF} title="Export PDF">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              PDF
            </button>
            <button
              className="btn-export"
              onClick={fetchGuests}
              title="Refresh"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Guest List */}
        {loading ? (
          <p className="loading-text">Memuat data tamu...</p>
        ) : guests.length === 0 ? (
          <p className="empty-text">Belum ada data RSVP.</p>
        ) : (
          <div className="guest-list">
            {guests.map(g => {
              const dt = new Date(g.timestamp).toLocaleString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              });
              const compText = g.attendance === 'hadir' && g.companions > 0
                ? ` · +${g.companions} pendamping`
                : '';
              return (
                <div className="guest-entry" key={g.id}>
                  <div className="guest-entry-info">
                    <div className="guest-entry-name">{g.name}</div>
                    <div className="guest-entry-detail">{g.phone}{compText}</div>
                    <div className="guest-entry-detail">{dt}</div>
                    {g.message && (
                      <div className="guest-entry-message">&ldquo;{g.message}&rdquo;</div>
                    )}
                  </div>
                  <div className="guest-entry-actions">
                    <span className={`guest-entry-badge badge-${g.attendance}`}>
                      {g.attendance === 'hadir' ? 'HADIR' : 'TIDAK'}
                    </span>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(g.id, g.name)}
                      title="Hapus tamu"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
