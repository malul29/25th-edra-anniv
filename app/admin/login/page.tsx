'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error ?? 'Signum secretum erroneum — Password salah');
      }
    } catch {
      setError('Error retis — Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Image
          src="/assets/edra-logo.png"
          alt="Edra"
          width={52}
          height={52}
          className="login-logo"
          style={{ width: 52, height: 'auto' }}
          priority
        />
        <h1 className="login-title">Sanctum Adminii</h1>
        <p className="login-subtitle">EDRA ARSITEK · XXV ANNIVERSARY</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-password">Signum Secretum</label>
            <input
              type="password"
              id="admin-password"
              name="password"
              placeholder="Enter password..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button
            type="submit"
            className="btn-glass btn-submit"
            disabled={loading}
          >
            <span>{loading ? 'Verificando...' : 'Masuk'}</span>
            {!loading && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            )}
          </button>
        </form>

        <div style={{ marginTop: 24 }}>
          <a href="/" style={{
            fontSize: '0.6rem', color: 'var(--crimson-lt)',
            letterSpacing: '0.15em', fontFamily: 'var(--gothic)',
            textTransform: 'uppercase', opacity: 0.7,
          }}>
            ← Redi ad Invitationem
          </a>
        </div>
      </div>
    </div>
  );
}
