import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, Database, CheckCircle2, RefreshCw } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    const data = await apiClient.getHealth();
    setStatus(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  const isPrivacy = status.privacy_active || status.system_mode === 'PRIVATE';
  const isMaintenance = status.maintenance_active || status.system_mode === 'MAINTENANCE';

  let badgeColor = '#10b981'; // Green
  let modeLabel = 'SYSTEM ONLINE';

  if (isPrivacy) {
    badgeColor = '#ef4444'; // Red
    modeLabel = 'PRIVATE MODE';
  } else if (isMaintenance) {
    badgeColor = '#f59e0b'; // Amber
    modeLabel = 'MAINTENANCE MODE';
  }

  return (
    <div className="position-fixed bottom-0 start-0 m-3 z-3">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn glass-card border-0 py-1.5 px-3 rounded-pill d-flex align-items-center gap-2 shadow-sm font-code text-white small"
        style={{ backdropFilter: 'blur(10px)', fontSize: '0.75rem', cursor: 'pointer' }}
        title="View Live System Health Metrics"
      >
        <span
          className="rounded-circle d-inline-block pulse-animation"
          style={{ width: '8px', height: '8px', backgroundColor: badgeColor }}
        ></span>
        <span className="fw-semibold">{modeLabel}</span>
        <Activity size={14} className="text-secondary ms-1" />
      </button>

      {/* Expanded Modal Popup */}
      {isOpen && (
        <div
          className="glass-panel p-3 rounded-3 shadow-lg position-absolute bottom-100 start-0 mb-2 font-code"
          style={{ width: '280px', fontSize: '0.8rem', zIndex: 1050 }}
        >
          <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-25 pb-2 mb-2">
            <span className="fw-bold text-primary d-flex align-items-center gap-1.5">
              <Cpu size={16} className="text-cyan-400" />
              Live Health Status
            </span>
            <button
              onClick={fetchStatus}
              className="btn btn-sm text-secondary p-0 border-0"
              title="Refresh Health Check"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Operational Metrics */}
          <div className="d-flex flex-column gap-2 mb-2">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-secondary">Frontend CDN:</span>
              <span className="text-emerald-400 font-semibold">● {status.services?.frontend || 'ONLINE'}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-secondary">Django REST API:</span>
              <span className={status.services?.api === 'ONLINE' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                ● {status.services?.api || 'ONLINE'}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-secondary">Relational DB:</span>
              <span className={status.metrics?.database_connected ? 'text-emerald-400 font-semibold' : 'text-danger font-semibold'}>
                ● {status.metrics?.database_connected ? 'CONNECTED' : 'OFFLINE'}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-secondary">AI Intelligence:</span>
              <span className="text-cyan-400 font-semibold">● {status.services?.ai || 'READY'}</span>
            </div>
            {status.metrics?.api_latency_ms && (
              <div className="d-flex align-items-center justify-content-between border-top border-secondary border-opacity-10 pt-1 mt-1 text-muted small">
                <span>API Latency:</span>
                <span>{status.metrics.api_latency_ms} ms</span>
              </div>
            )}
          </div>

          {(isPrivacy || isMaintenance) && (
            <div className="alert alert-warning p-2 mb-0 small mt-2 d-flex align-items-center gap-1.5" style={{ fontSize: '0.7rem' }}>
              <ShieldAlert size={16} />
              <span>{status.maintenance_message || 'Access currently guarded by admin.'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
