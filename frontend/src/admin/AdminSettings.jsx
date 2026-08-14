import React, { useState, useEffect } from 'react';
import { ShieldAlert, Save, Check, AlertTriangle, ShieldCheck, Lock, Activity, RefreshCw } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    privacy_mode: 'PUBLIC',
    maintenance_message: '',
    allow_contact_form: true,
    allow_ai_assistant: true
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSettingsAndLogs = async () => {
    setLoading(true);
    try {
      const [sets, logs] = await Promise.all([
        adminApiClient.getSiteSettings(),
        adminApiClient.getAuditLogs().catch(() => [])
      ]);
      setSettings(sets);
      setAuditLogs(Array.isArray(logs) ? logs : (logs.results || []));
    } catch (err) {
      showToast(err.message || 'Failed to load system settings.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndLogs();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminApiClient.updateSiteSettings(settings);
      setSettings(updated);
      showToast('System privacy & settings updated successfully!');
      fetchSettingsAndLogs();
    } catch (err) {
      showToast(err.message || 'Failed to save settings.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info" role="status"></div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {toast && (
        <div className={`admin-toast ${toast.type === 'danger' ? 'bg-danger text-white' : 'bg-success text-white'}`}>
          {toast.type === 'danger' ? <AlertTriangle size={18} /> : <Check size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div>
          <h1 className="h3 text-white fw-bold mb-1">System & Privacy Controls</h1>
          <p className="text-secondary small font-monospace mb-0">
            Control application availability, public maintenance guards, and inspect audit activity.
          </p>
        </div>
        <button
          type="submit"
          form="settings-form"
          disabled={saving}
          className="admin-btn admin-btn-primary"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Apply Controls'}</span>
        </button>
      </div>

      {/* Privacy Mode Selector */}
      <form id="settings-form" onSubmit={handleSaveSettings} className="d-flex flex-column gap-4">
        <div className="admin-card p-4">
          <h2 className="h6 text-white fw-bold mb-3 d-flex align-items-center gap-2 font-monospace">
            <ShieldAlert size={16} style={{ color: 'var(--admin-cyan)' }} />
            <span>GLOBAL PRIVACY & ACCESS LEVEL</span>
          </h2>

          <div className="row g-3">
            {/* PUBLIC */}
            <div className="col-md-4">
              <div 
                onClick={() => setSettings({ ...settings, privacy_mode: 'PUBLIC' })}
                className={`p-3 rounded-3 cursor-pointer h-100 transition-all ${settings.privacy_mode === 'PUBLIC' ? 'border border-cyan-400 bg-info bg-opacity-10 shadow-lg' : 'border border-secondary border-opacity-25'}`}
                style={{ cursor: 'pointer', background: settings.privacy_mode === 'PUBLIC' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.2)' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="admin-badge admin-badge-success">● PUBLIC MODE</span>
                  <input
                    type="radio"
                    name="privacy_mode"
                    checked={settings.privacy_mode === 'PUBLIC'}
                    onChange={() => setSettings({ ...settings, privacy_mode: 'PUBLIC' })}
                  />
                </div>
                <div className="text-secondary small" style={{ fontSize: '0.8rem' }}>
                  Full public access to projects, skills, CV, and AI chatbot.
                </div>
              </div>
            </div>

            {/* MAINTENANCE */}
            <div className="col-md-4">
              <div 
                onClick={() => setSettings({ ...settings, privacy_mode: 'MAINTENANCE' })}
                className={`p-3 rounded-3 cursor-pointer h-100 transition-all ${settings.privacy_mode === 'MAINTENANCE' ? 'border border-warning bg-warning bg-opacity-10 shadow-lg' : 'border border-secondary border-opacity-25'}`}
                style={{ cursor: 'pointer', background: settings.privacy_mode === 'MAINTENANCE' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0,0,0,0.2)' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="admin-badge admin-badge-warning">● MAINTENANCE</span>
                  <input
                    type="radio"
                    name="privacy_mode"
                    checked={settings.privacy_mode === 'MAINTENANCE'}
                    onChange={() => setSettings({ ...settings, privacy_mode: 'MAINTENANCE' })}
                  />
                </div>
                <div className="text-secondary small" style={{ fontSize: '0.8rem' }}>
                  Displays scheduled maintenance notice across public endpoints.
                </div>
              </div>
            </div>

            {/* PRIVATE */}
            <div className="col-md-4">
              <div 
                onClick={() => setSettings({ ...settings, privacy_mode: 'PRIVATE' })}
                className={`p-3 rounded-3 cursor-pointer h-100 transition-all ${settings.privacy_mode === 'PRIVATE' ? 'border border-danger bg-danger bg-opacity-10 shadow-lg' : 'border border-secondary border-opacity-25'}`}
                style={{ cursor: 'pointer', background: settings.privacy_mode === 'PRIVATE' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(0,0,0,0.2)' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="admin-badge admin-badge-danger">● PRIVATE SHIELD</span>
                  <input
                    type="radio"
                    name="privacy_mode"
                    checked={settings.privacy_mode === 'PRIVATE'}
                    onChange={() => setSettings({ ...settings, privacy_mode: 'PRIVATE' })}
                  />
                </div>
                <div className="text-secondary small" style={{ fontSize: '0.8rem' }}>
                  Restricts public data fetching. Only authenticated admin can view.
                </div>
              </div>
            </div>

            {/* Maintenance Message */}
            <div className="col-12 mt-3">
              <label className="admin-label">Maintenance / Shield Message</label>
              <textarea
                rows="2"
                value={settings.maintenance_message}
                onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })}
                placeholder="System undergoing planned architecture updates. Public API endpoints are temporarily guarded."
                className="admin-textarea"
              />
            </div>

            {/* Feature Toggles */}
            <div className="col-md-6 mt-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="allowContactToggle"
                  checked={settings.allow_contact_form}
                  onChange={(e) => setSettings({ ...settings, allow_contact_form: e.target.checked })}
                />
                <label className="form-check-label text-white small fw-semibold" htmlFor="allowContactToggle">
                  Enable Public Contact Form Submissions
                </label>
              </div>
            </div>

            <div className="col-md-6 mt-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="allowAIToggle"
                  checked={settings.allow_ai_assistant}
                  onChange={(e) => setSettings({ ...settings, allow_ai_assistant: e.target.checked })}
                />
                <label className="form-check-label text-white small fw-semibold" htmlFor="allowAIToggle">
                  Enable KIRAN AI Portfolio Assistant
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Admin Audit Logs */}
      <div className="admin-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h6 text-white fw-bold mb-0 d-flex align-items-center gap-2 font-monospace">
            <Activity size={16} style={{ color: 'var(--admin-cyan)' }} />
            <span>ADMIN AUDIT TRAIL (LAST 100 ACTIONS)</span>
          </h2>
          <button onClick={fetchSettingsAndLogs} className="admin-btn admin-btn-outline admin-btn-sm p-1">
            <RefreshCw size={13} />
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-secondary small py-2 mb-0">No audit activity logged yet.</p>
        ) : (
          <div className="admin-table-container" style={{ maxHeight: '320px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-monospace small text-muted" style={{ fontSize: '0.725rem', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className={`admin-badge ${log.action === 'CREATE' ? 'admin-badge-success' : log.action === 'DELETE' ? 'admin-badge-danger' : log.action === 'LOGIN' ? 'admin-badge-info' : 'admin-badge-purple'}`} style={{ fontSize: '0.68rem' }}>
                        {log.action}
                      </span>
                    </td>
                    <td className="text-white small font-monospace">{log.model_name}</td>
                    <td className="text-secondary small font-monospace text-truncate" style={{ maxWidth: '300px', fontSize: '0.725rem' }}>
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
