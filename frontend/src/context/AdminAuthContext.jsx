import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApiClient } from '../services/adminApiClient';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('suryakiran_admin_token') || null);
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('suryakiran_admin_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  // Validate session on mount if token exists
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const storedToken = localStorage.getItem('suryakiran_admin_token');
      if (storedToken) {
        try {
          const userData = await adminApiClient.getMe();
          if (isMounted) {
            setUser(userData);
            localStorage.setItem('suryakiran_admin_user', JSON.stringify(userData));
          }
        } catch (err) {
          if (isMounted) {
            setToken(null);
            setUser(null);
            localStorage.removeItem('suryakiran_admin_token');
            localStorage.removeItem('suryakiran_admin_user');
          }
        }
      }
      if (isMounted) setLoading(false);
    }

    checkAuth();

    // Listen for 401 expiration events
    const handleExpired = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('admin-auth-expired', handleExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('admin-auth-expired', handleExpired);
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await adminApiClient.login(username, password);
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('suryakiran_admin_token', res.token);
      localStorage.setItem('suryakiran_admin_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error('Authentication failed.');
  }, []);

  const logout = useCallback(async () => {
    await adminApiClient.logout();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
