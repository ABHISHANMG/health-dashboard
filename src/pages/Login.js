import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FIREBASE_ERRORS = {
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/email-already-in-use': 'This email is already registered. Try signing in.',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/popup-closed-by-user': null, // silent dismiss
};

function validate(fields, isRegister) {
  const errors = {};

  if (isRegister && !fields.name.trim()) {
    errors.name = 'Full name is required';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!fields.password) {
    errors.password = 'Password is required';
  } else if (fields.password.length < 6) {
    errors.password = 'Must be at least 6 characters';
  }

  if (isRegister) {
    if (!fields.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (fields.password !== fields.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
}

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const setField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    // Clear field error on type
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    }
    if (firebaseError) setFirebaseError('');
  };

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validate(fields, isRegister);
    if (errs[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: errs[key] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFirebaseError('');
    setSuccessMsg('');

    const errs = validate(fields, isRegister);
    setFieldErrors(errs);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(fields.email, fields.password, fields.name);
        navigate('/');
      } else {
        await loginWithEmail(fields.email, fields.password);
        navigate('/');
      }
    } catch (err) {
      const msg = FIREBASE_ERRORS[err.code];
      if (msg === null) return; // silent (popup closed)
      setFirebaseError(msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFirebaseError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      const msg = FIREBASE_ERRORS[err.code];
      if (msg === null) return;
      setFirebaseError(msg || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setFieldErrors({});
    setFirebaseError('');
    setSuccessMsg('');
    setTouched({});
    setFields({ name: '', email: '', password: '', confirmPassword: '' });
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

        {/* Right — Auth Form */}
        <div style={styles.right}>
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p style={styles.formSubtitle}>
              {isRegister ? 'Start managing your practice today' : 'Sign in to access your dashboard'}
            </p>

            {/* Firebase error */}
            {firebaseError && (
              <div style={styles.errorBox}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{firebaseError}</span>
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div style={styles.successBox}>
                <CheckCircle size={16} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Google OAuth */}
            <button
              style={{ ...styles.googleBtn, opacity: loading ? 0.7 : 1 }}
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
              {loading ? 'Please wait...' : `Continue with Google`}
            </button>

            {/* Divider */}
            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>or {isRegister ? 'sign up' : 'sign in'} with email</span>
              <span style={styles.dividerLine} />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Name — register only */}
              {isRegister && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <div style={{ ...styles.inputWrapper, ...(fieldErrors.name && touched.name ? styles.inputError : {}) }}>
                    <User size={16} style={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="Dr. John Smith"
                      value={fields.name}
                      onChange={(e) => setField('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      style={styles.input}
                    />
                  </div>
                  {fieldErrors.name && touched.name && <span style={styles.fieldError}>{fieldErrors.name}</span>}
                </div>
              )}

              {/* Email */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div style={{ ...styles.inputWrapper, ...(fieldErrors.email && touched.email ? styles.inputError : {}) }}>
                  <Mail size={16} style={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={fields.email}
                    onChange={(e) => setField('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    style={styles.input}
                    autoComplete="email"
                  />
                </div>
                {fieldErrors.email && touched.email && <span style={styles.fieldError}>{fieldErrors.email}</span>}
              </div>

              {/* Password */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={{ ...styles.inputWrapper, ...(fieldErrors.password && touched.password ? styles.inputError : {}) }}>
                  <Lock size={16} style={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isRegister ? 'Create a password (min 6 chars)' : 'Enter your password'}
                    value={fields.password}
                    onChange={(e) => setField('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    style={styles.input}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && touched.password && <span style={styles.fieldError}>{fieldErrors.password}</span>}
                {/* Password strength indicator for register */}
                {isRegister && fields.password && (
                  <div style={styles.strengthBar}>
                    <div style={{
                      ...styles.strengthFill,
                      width: fields.password.length < 6 ? '33%' : fields.password.length < 10 ? '66%' : '100%',
                      background: fields.password.length < 6 ? '#ef4444' : fields.password.length < 10 ? '#f59e0b' : '#10b981',
                    }} />
                    <span style={styles.strengthLabel}>
                      {fields.password.length < 6 ? 'Weak' : fields.password.length < 10 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password — register only */}
              {isRegister && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <div style={{ ...styles.inputWrapper, ...(fieldErrors.confirmPassword && touched.confirmPassword ? styles.inputError : {}) }}>
                    <Lock size={16} style={styles.inputIcon} />
                    <input
                      type="password"
                      placeholder="Re-enter your password"
                      value={fields.confirmPassword}
                      onChange={(e) => setField('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      style={styles.input}
                      autoComplete="new-password"
                    />
                    {fields.confirmPassword && fields.password === fields.confirmPassword && (
                      <CheckCircle size={16} style={{ position: 'absolute', right: 12, color: '#10b981' }} />
                    )}
                  </div>
                  {fieldErrors.confirmPassword && touched.confirmPassword && (
                    <span style={styles.fieldError}>{fieldErrors.confirmPassword}</span>
                  )}
                </div>
              )}

              <button
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <p style={styles.switchText}>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" style={styles.switchBtn} onClick={switchMode}>
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
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
    maxWidth: 980,
    minHeight: 600,
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
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
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
    padding: '40px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
  },
  formContainer: { width: '100%', maxWidth: 360 },
  formTitle: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 6 },
  formSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 14px', background: '#fee2e2', color: '#991b1b',
    borderRadius: 8, fontSize: 13, marginBottom: 16,
  },
  successBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 14px', background: '#d1fae5', color: '#065f46',
    borderRadius: 8, fontSize: 13, marginBottom: 16,
  },
  googleBtn: {
    width: '100%', padding: '11px 16px',
    border: '1px solid #d1d5db', borderRadius: 8, background: '#fff',
    fontSize: 14, fontWeight: 500, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10, transition: 'all 0.2s', color: '#374151',
  },
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' },
  dividerLine: { flex: 1, height: 1, background: '#e5e7eb' },
  dividerText: { fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' },
  inputGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 },
  inputWrapper: {
    position: 'relative', display: 'flex', alignItems: 'center',
    border: '1px solid #d1d5db', borderRadius: 8, transition: 'border-color 0.2s',
  },
  inputError: { borderColor: '#ef4444' },
  inputIcon: { position: 'absolute', left: 12, color: '#9ca3af', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '10px 12px 10px 38px',
    border: 'none', borderRadius: 8, fontSize: 14, outline: 'none',
    background: 'transparent',
  },
  eyeBtn: {
    position: 'absolute', right: 10, background: 'none', border: 'none',
    cursor: 'pointer', color: '#9ca3af', padding: 4,
  },
  fieldError: { display: 'block', fontSize: 12, color: '#ef4444', marginTop: 4 },
  strengthBar: {
    display: 'flex', alignItems: 'center', gap: 8, marginTop: 6,
  },
  strengthFill: {
    height: 4, borderRadius: 2, transition: 'all 0.3s', flex: 1, maxWidth: 120,
  },
  strengthLabel: { fontSize: 11, color: '#6b7280' },
  submitBtn: {
    width: '100%', padding: '11px 16px',
    background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4,
    transition: 'background 0.2s',
  },
  switchText: { textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 20 },
  switchBtn: {
    background: 'none', border: 'none', color: '#2563eb',
    fontWeight: 600, cursor: 'pointer', fontSize: 13,
  },
};
