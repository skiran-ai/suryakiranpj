import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, Terminal, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../styles/admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both your username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username.trim(), password.trim());
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center px-3 position-relative" style={{ background: '#070913' }}>
      {/* Background ambient lighting */}
      <div 
        className="position-absolute"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      />

      <div className="w-100" style={{ maxWidth: '420px', zIndex: 10 }}>
        {/* Back Link */}
        <Link 
          to="/"
          className="d-inline-flex align-items-center gap-1 text-secondary text-decoration-none small mb-4 hover-cyan font-monospace"
        >
          <ArrowLeft size={15} />
          <span>Back to Portfolio</span>
        </Link>

        {/* Card */}
        <div className="admin-card p-4 p-sm-5 position-relative shadow-2xl">
          {/* Header */}
          <div className="text-center mb-4">
            <div 
              className="rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3"
              style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.2))', border: '1px solid var(--admin-border-active)' }}
            >
              <ShieldCheck size={32} style={{ color: 'var(--admin-cyan)' }} />
            </div>
            <h1 className="h4 text-white fw-bold mb-1">Command Center</h1>
            <p className="text-secondary small font-monospace mb-0">Private Administrator Authentication</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 rounded-3 d-flex align-items-center gap-2" style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185' }}>
              <AlertCircle size={18} className="flex-shrink-0" />
              <span className="small">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="admin-label">Admin Username</label>
              <div className="position-relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="admin-input ps-5"
                  autoComplete="username"
                  autoFocus
                  required
                />
                <User size={17} className="position-absolute top-50 translate-middle-y ms-3 text-secondary" />
              </div>
            </div>

            <div>
              <label className="admin-label">Password</label>
              <div className="position-relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="admin-input ps-5"
                  autoComplete="current-password"
                  required
                />
                <Lock size={17} className="position-absolute top-50 translate-middle-y ms-3 text-secondary" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-btn admin-btn-primary py-2.5 mt-2 w-100 font-monospace"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner-border spinner-border-sm" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Terminal size={17} />
                  <span>Authorize Session</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
            <span className="text-muted font-monospace" style={{ fontSize: '0.725rem' }}>
              Protected by DRF Token Authentication & Role Validation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
