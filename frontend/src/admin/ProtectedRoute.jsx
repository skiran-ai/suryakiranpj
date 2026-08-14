import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ background: '#070913' }}>
        <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Authenticating...</span>
        </div>
        <p className="text-secondary mt-3 font-monospace small">Verifying Administrator Privileges...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
