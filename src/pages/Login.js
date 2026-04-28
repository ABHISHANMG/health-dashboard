import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Left — Branding */}
        <div style={styles.left}>
          <div style={styles.brandContent}>
            <div style={styles.logoRow}>
              <div style={styles.logoIcon}><Heart size={24} /></div>
              <span style={styles.logoText}>MedFlow</span>
            </div>
            <h1 style={styles.tagline}>Healthcare Management, Simplified</h1>
            <p style={styles.subtitle}>
              Streamline patient care, appointments, and analytics — all in one secure platform built for modern healthcare teams.
            </p>
            <div style={styles.features}>
              {['HIPAA Compliant', 'Real-time Analytics', 'Role-based Access'].map((f) => (
                <div key={f} style={styles.featureItem}>
                  <div style={styles.featureCheck}>&#10003;</div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Google Login */}
        <div style={styles.right}>
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSubtitle}>Sign in to access your dashboard</p>

            {error && (
              <div style={styles.errorBox}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              style={{
                ...styles.googleBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <p style={styles.terms}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f4f8',
    padding: 20,
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: 960,
    minHeight: 520,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
    background: '#fff',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
    color: '#fff',
    padding: 48,
    display: 'flex',
    alignItems: 'center',
  },
  brandContent: { maxWidth: 380 },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 22, fontWeight: 700 },
  tagline: { fontSize: 28, fontWeight: 700, lineHeight: 1.3, marginBottom: 16 },
  subtitle: { fontSize: 15, lineHeight: 1.6, color: '#94a3b8', marginBottom: 32 },
  features: { display: 'flex', flexDirection: 'column', gap: 12 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#cbd5e1' },
  featureCheck: {
    width: 22, height: 22, borderRadius: '50%',
    background: 'rgba(59,130,246,0.2)', color: '#60a5fa',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
  },
  right: {
    flex: 1,
    padding: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: { width: '100%', maxWidth: 340, textAlign: 'center' },
  formTitle: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 6 },
  formSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 32 },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 14px', background: '#fee2e2', color: '#991b1b',
    borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: 'left',
  },
  googleBtn: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    background: '#fff',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'all 0.2s',
    color: '#374151',
  },
  terms: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 20,
    lineHeight: 1.5,
  },
};
