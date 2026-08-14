import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Check, AlertTriangle, CheckCircle, Clock, Eye, MailOpen } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getMessages(unreadOnly);
      setMessages(data);
    } catch (err) {
      showToast(err.message || 'Failed to load messages.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [unreadOnly]);

  const handleToggleRead = async (msg) => {
    const newStatus = !msg.is_read;
    try {
      await adminApiClient.updateMessage(msg.id, { is_read: newStatus });
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: newStatus } : m));
      showToast(`Message marked as ${newStatus ? 'Read' : 'Unread'}.`);
    } catch (err) {
      showToast(err.message || 'Failed to update status.', 'danger');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteMessage(deleteTarget.id);
      showToast(`Inquiry message deleted.`);
      setDeleteTarget(null);
      setMessages(prev => prev.filter(m => m.id !== deleteTarget.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete message.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {toast && (
        <div className={`admin-toast ${toast.type === 'danger' ? 'bg-danger text-white' : 'bg-success text-white'}`}>
          {toast.type === 'danger' ? <AlertTriangle size={18} /> : <Check size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div>
          <h1 className="h3 text-white fw-bold mb-1">Contact Inquiries</h1>
          <p className="text-secondary small font-monospace mb-0">
            Messages and project requests received from the public portfolio contact form.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            onClick={() => setUnreadOnly(false)}
            className={`admin-btn admin-btn-sm ${!unreadOnly ? 'admin-btn-primary' : 'admin-btn-outline'}`}
          >
            All Messages
          </button>
          <button
            onClick={() => setUnreadOnly(true)}
            className={`admin-btn admin-btn-sm ${unreadOnly ? 'admin-btn-primary' : 'admin-btn-outline'}`}
          >
            Unread Only
          </button>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <Mail size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No Inquiries Found</h2>
          <p className="text-secondary small mb-0">No contact messages matching this filter.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className="admin-card p-4 transition-all"
              style={{ background: msg.is_read ? 'var(--admin-card-bg)' : 'rgba(56, 189, 248, 0.08)' }}
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="fw-bold text-white h6 mb-0">{msg.name}</span>
                    {!msg.is_read ? (
                      <span className="admin-badge admin-badge-danger">NEW UNREAD</span>
                    ) : (
                      <span className="admin-badge admin-badge-success">READ</span>
                    )}
                  </div>
                  <div className="text-cyan-400 small font-monospace">
                    <a href={`mailto:${msg.email}`} className="text-cyan-400 text-decoration-none hover-cyan">
                      {msg.email}
                    </a>
                    {msg.ip_address && <span className="text-muted ms-2">IP: {msg.ip_address}</span>}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted font-monospace small" style={{ fontSize: '0.725rem' }}>
                    <Clock size={12} className="me-1" />
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleToggleRead(msg)}
                    className="admin-btn admin-btn-outline admin-btn-sm"
                    title={msg.is_read ? "Mark as Unread" : "Mark as Read"}
                  >
                    {msg.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
                    <span>{msg.is_read ? 'Unread' : 'Mark Read'}</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(msg)}
                    className="admin-btn admin-btn-danger admin-btn-sm p-1.5"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {msg.subject && (
                <div className="fw-semibold text-white small mb-2">
                  Subject: <span className="text-secondary">{msg.subject}</span>
                </div>
              )}

              <div className="p-3 rounded-2 small text-white" style={{ background: 'rgba(0,0,0,0.25)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog p-4">
            <h2 className="h5 text-white fw-bold mb-3">Delete Message</h2>
            <p className="text-secondary small mb-4">Are you sure you want to delete message from "{deleteTarget.name}" ({deleteTarget.email})?</p>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="admin-btn admin-btn-outline">Cancel</button>
              <button type="button" disabled={actionLoading} onClick={handleDelete} className="admin-btn admin-btn-danger">
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
