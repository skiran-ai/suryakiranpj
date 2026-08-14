import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FolderGit2, Cpu, Wrench, Briefcase, GraduationCap, 
  Award, Trophy, Share2, UserCircle, Bot, Mail, ShieldAlert, LogOut, 
  ExternalLink, Menu, X, Terminal, ChevronRight
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminApiClient } from '../services/adminApiClient';
import '../styles/admin.css';

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    adminApiClient.getStats()
      .then(data => {
        if (data?.counts?.unread_messages !== undefined) {
          setUnreadCount(data.counts.unread_messages);
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out of the Admin Command Center?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/admin/skills', label: 'Skills', icon: Cpu },
    { to: '/admin/services', label: 'Services', icon: Wrench },
    { to: '/admin/experience', label: 'Experience', icon: Briefcase },
    { to: '/admin/education', label: 'Education', icon: GraduationCap },
    { to: '/admin/certifications', label: 'Certifications', icon: Award },
    { to: '/admin/achievements', label: 'Achievements', icon: Trophy },
    { to: '/admin/social-links', label: 'Social Links', icon: Share2 },
    { to: '/admin/profile', label: 'Profile', icon: UserCircle },
    { to: '/admin/ai-documents', label: 'AI Knowledge', icon: Bot },
    { to: '/admin/messages', label: 'Inquiries', icon: Mail, badge: unreadCount },
    { to: '/admin/settings', label: 'Site Privacy', icon: ShieldAlert },
  ];

  return (
    <div className="admin-wrapper">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="position-fixed inset-0 bg-black bg-opacity-75 z-index-1035 d-lg-none"
          style={{ position: 'fixed', inset: 0, zIndex: 1035, background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-3 p-1.5 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #0284c7, #6366f1)' }}>
              <Terminal size={18} className="text-white" />
            </div>
            <div>
              <div className="fw-bold text-white small" style={{ letterSpacing: '0.04em' }}>SURYAKIRAN<span style={{ color: 'var(--admin-cyan)' }}>.CORE</span></div>
              <div className="text-muted font-monospace" style={{ fontSize: '0.68rem' }}>ADMIN COMMAND CENTER</div>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-link text-secondary d-lg-none p-0"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="admin-badge-count unread">{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-outline admin-btn-sm text-secondary"
            title="View Public Portfolio"
          >
            <ExternalLink size={14} />
            <span>Public Site</span>
          </a>
          <button
            onClick={handleLogout}
            className="admin-btn admin-btn-danger admin-btn-sm"
            title="Log Out"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-link text-white p-0 d-lg-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={22} />
            </button>
            <div className="d-flex align-items-center gap-2 text-secondary small font-monospace">
              <span>CONSOLE</span>
              <ChevronRight size={14} />
              <span className="text-white fw-semibold">
                {location.pathname.replace('/admin', '') || 'OVERVIEW'}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
              <span className="small text-muted font-monospace d-none d-sm-inline">API ONLINE</span>
            </div>
            <div className="admin-badge admin-badge-info">
              <UserCircle size={14} />
              <span>{user?.username || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <main className="admin-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
