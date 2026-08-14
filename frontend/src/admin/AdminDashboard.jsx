import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, Cpu, Wrench, Briefcase, GraduationCap, Award, 
  Trophy, Bot, Mail, Plus, ExternalLink, RefreshCw, CheckCircle, 
  Clock, ShieldAlert, Sparkles
} from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApiClient.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading Command Center...</span>
        </div>
        <p className="text-secondary mt-3 font-monospace small">Fetching Live PostgreSQL Statistics...</p>
      </div>
    );
  }

  const counts = stats?.counts || {};
  const system = stats?.system || {};
  const recentProjects = stats?.recent_projects || [];
  const recentMessages = stats?.recent_messages || [];

  const statCards = [
    { title: 'Projects', value: counts.projects_total || 0, subtitle: `${counts.projects_published || 0} Published • ${counts.projects_draft || 0} Draft`, icon: FolderGit2, color: 'var(--admin-cyan)', link: '/admin/projects' },
    { title: 'Skills', value: counts.skills || 0, subtitle: 'Across 4 Categories', icon: Cpu, color: 'var(--admin-indigo)', link: '/admin/skills' },
    { title: 'Services', value: counts.services || 0, subtitle: 'Contract Offerings', icon: Wrench, color: 'var(--admin-emerald)', link: '/admin/services' },
    { title: 'Experience', value: counts.experience || 0, subtitle: 'Career Milestones', icon: Briefcase, color: 'var(--admin-amber)', link: '/admin/experience' },
    { title: 'Education', value: counts.education || 0, subtitle: 'Degree & University', icon: GraduationCap, color: '#38bdf8', link: '/admin/education' },
    { title: 'Certifications', value: counts.certifications || 0, subtitle: 'Verified Credentials', icon: Award, color: '#ec4899', link: '/admin/certifications' },
    { title: 'Achievements', value: counts.achievements || 0, subtitle: 'Honors & Recognitions', icon: Trophy, color: '#f59e0b', link: '/admin/achievements' },
    { title: 'AI Documents', value: counts.ai_documents || 0, subtitle: 'Grounded Chatbot Base', icon: Bot, color: '#a855f7', link: '/admin/ai-documents' },
    { title: 'Contact Inquiries', value: counts.total_messages || 0, subtitle: `${counts.unread_messages || 0} Unread Inquiries`, icon: Mail, color: counts.unread_messages ? 'var(--admin-rose)' : 'var(--admin-emerald)', link: '/admin/messages' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Top Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h1 className="h3 text-white fw-bold mb-1">
            Welcome back, <span className="text-gradient">{user?.username || 'Suryakiran'}</span> 👋
          </h1>
          <p className="text-secondary small font-monospace mb-0">
            Real-time portfolio management directly mapped to Render PostgreSQL.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button 
            onClick={fetchStats}
            className="admin-btn admin-btn-outline admin-btn-sm"
            title="Refresh Live Data"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <Link to="/admin/projects/new" className="admin-btn admin-btn-primary admin-btn-sm">
            <Plus size={15} />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="admin-card border-danger text-danger p-3 small">
          {error}
        </div>
      )}

      {/* System Mode Alert / Status Banner */}
      <div className="admin-card p-3 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3" style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7))' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle p-2" style={{ background: system.privacy_mode === 'PUBLIC' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)' }}>
            <ShieldAlert size={22} style={{ color: system.privacy_mode === 'PUBLIC' ? '#34d399' : '#fbbf24' }} />
          </div>
          <div>
            <div className="small fw-bold text-white d-flex align-items-center gap-2">
              <span>SYSTEM PRIVACY STATUS:</span>
              <span className={`admin-badge ${system.privacy_mode === 'PUBLIC' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                ● {system.privacy_mode || 'PUBLIC'} MODE
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.775rem' }}>
              {system.privacy_mode === 'PUBLIC' 
                ? 'All public REST API endpoints and portfolio showcase items are operating normally.' 
                : system.maintenance_message}
            </div>
          </div>
        </div>
        <Link to="/admin/settings" className="admin-btn admin-btn-outline admin-btn-sm font-monospace text-nowrap">
          Change Mode
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="row g-3">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="col-sm-6 col-lg-4">
              <Link to={stat.link} className="text-decoration-none">
                <div className="admin-card admin-stat-card h-100">
                  <div className="admin-stat-icon" style={{ background: `${stat.color}18`, color: stat.color, border: `1px solid ${stat.color}35` }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="admin-stat-number text-white">{stat.value}</div>
                    <div className="fw-semibold text-white small">{stat.title}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{stat.subtitle}</div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="admin-card p-4">
        <h2 className="h6 text-white fw-bold mb-3 d-flex align-items-center gap-2 font-monospace">
          <Sparkles size={16} style={{ color: 'var(--admin-cyan)' }} />
          <span>QUICK ACTIONS</span>
        </h2>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/projects/new" className="admin-btn admin-btn-outline admin-btn-sm">
            <Plus size={14} /> Add Project
          </Link>
          <Link to="/admin/skills" className="admin-btn admin-btn-outline admin-btn-sm">
            <Plus size={14} /> Add Skill
          </Link>
          <Link to="/admin/services" className="admin-btn admin-btn-outline admin-btn-sm">
            <Plus size={14} /> Add Service
          </Link>
          <Link to="/admin/experience" className="admin-btn admin-btn-outline admin-btn-sm">
            <Plus size={14} /> Add Experience
          </Link>
          <Link to="/admin/ai-documents" className="admin-btn admin-btn-outline admin-btn-sm">
            <Plus size={14} /> Add AI Doc
          </Link>
          <Link to="/admin/profile" className="admin-btn admin-btn-outline admin-btn-sm">
            <Plus size={14} /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Two Column Grid: Recent Projects & Recent Messages */}
      <div className="row g-4">
        {/* Recent Projects */}
        <div className="col-lg-7">
          <div className="admin-card h-100 d-flex flex-column justify-content-between p-4">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h6 text-white fw-bold mb-0 font-monospace">RECENT PROJECTS</h2>
                <Link to="/admin/projects" className="small text-cyan-400 text-decoration-none hover-cyan font-monospace">
                  View All ({counts.projects_total || 0}) →
                </Link>
              </div>

              {recentProjects.length === 0 ? (
                <p className="text-secondary small py-3 mb-0">No projects found in database.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProjects.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="fw-semibold text-white">{p.title}</div>
                            <div className="text-muted small font-monospace" style={{ fontSize: '0.725rem' }}>/{p.slug}</div>
                          </td>
                          <td>
                            <span className="admin-badge admin-badge-info">{p.category}</span>
                          </td>
                          <td>
                            <span className={`admin-badge ${p.status === 'Published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <Link to={`/admin/projects/${p.id}/edit`} className="admin-btn admin-btn-outline admin-btn-sm">
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="col-lg-5">
          <div className="admin-card h-100 d-flex flex-column justify-content-between p-4">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h6 text-white fw-bold mb-0 font-monospace">RECENT INQUIRIES</h2>
                <Link to="/admin/messages" className="small text-cyan-400 text-decoration-none hover-cyan font-monospace">
                  View All ({counts.total_messages || 0}) →
                </Link>
              </div>

              {recentMessages.length === 0 ? (
                <p className="text-secondary small py-3 mb-0">No contact messages received yet.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {recentMessages.map((msg) => (
                    <div key={msg.id} className="p-2.5 rounded-3" style={{ background: msg.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-semibold text-white small">{msg.name}</span>
                        {!msg.is_read && <span className="admin-badge admin-badge-danger" style={{ fontSize: '0.65rem' }}>NEW</span>}
                      </div>
                      <div className="text-secondary small text-truncate mb-1">{msg.subject || msg.message}</div>
                      <div className="text-muted font-monospace" style={{ fontSize: '0.7rem' }}>{msg.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
