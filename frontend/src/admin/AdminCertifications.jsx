import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit3, Trash2, Check, AlertTriangle, ExternalLink } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    issuing_organization: '',
    issue_date: '2023-05-15',
    credential_id: '',
    credential_url: '',
    order: 0
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getCertifications();
      setCertifications(Array.isArray(data) ? data : (data.certifications || []));
    } catch (err) {
      showToast(err.message || 'Failed to load certifications.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      issuing_organization: '',
      issue_date: new Date().toISOString().split('T')[0],
      credential_id: '',
      credential_url: '',
      order: certifications.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      issuing_organization: item.issuing_organization || '',
      issue_date: item.issue_date || '',
      credential_id: item.credential_id || '',
      credential_url: item.credential_url || '',
      order: item.order || 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuing_organization.trim()) {
      showToast('Title and Issuing Organization are required.', 'danger');
      return;
    }

    setActionLoading(true);
    try {
      if (editingItem) {
        await adminApiClient.updateCertification(editingItem.id, formData);
        showToast(`Certification "${formData.title}" updated.`);
      } else {
        await adminApiClient.createCertification(formData);
        showToast(`Certification "${formData.title}" created.`);
      }
      setModalOpen(false);
      fetchCertifications();
    } catch (err) {
      showToast(err.message || 'Failed to save certification.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteCertification(deleteTarget.id);
      showToast(`Certification deleted.`);
      setDeleteTarget(null);
      setCertifications(prev => prev.filter(c => c.id !== deleteTarget.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete certification.', 'danger');
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
          <h1 className="h3 text-white fw-bold mb-1">Certifications</h1>
          <p className="text-secondary small font-monospace mb-0">
            Showcase verified technical credentials, full-stack academies, and cloud certifications.
          </p>
        </div>
        <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : certifications.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <Award size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No Certifications Found</h2>
          <button onClick={openCreateModal} className="admin-btn admin-btn-primary admin-btn-sm mt-3">
            <Plus size={14} /> Add Certification
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {certifications.map(cert => (
            <div key={cert.id} className="col-md-6">
              <div className="admin-card h-100 d-flex flex-column justify-content-between p-4">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="admin-badge admin-badge-purple">{cert.issuing_organization}</span>
                    <span className="text-muted font-monospace small">{cert.issue_date}</span>
                  </div>

                  <h2 className="h6 text-white fw-bold mb-2">{cert.title}</h2>
                  
                  {cert.credential_id && (
                    <div className="text-secondary small font-monospace mb-2" style={{ fontSize: '0.75rem' }}>
                      ID: {cert.credential_id}
                    </div>
                  )}

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center gap-1 small text-cyan-400 text-decoration-none font-monospace"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top border-secondary border-opacity-25">
                  <button onClick={() => openEditModal(cert)} className="admin-btn admin-btn-outline admin-btn-sm">
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(cert)} className="admin-btn admin-btn-danger admin-btn-sm">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog p-4">
            <h2 className="h5 text-white fw-bold mb-3 font-monospace">
              {editingItem ? `Edit: ${editingItem.title}` : 'Add Certification'}
            </h2>

            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div>
                <label className="admin-label">Certification Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Python & Django Full Stack Engineering"
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="admin-label">Issuing Organization *</label>
                <input
                  type="text"
                  value={formData.issuing_organization}
                  onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
                  placeholder="e.g. Full Stack Software Academy"
                  className="admin-input"
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-sm-6">
                  <label className="admin-label">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="admin-label">Credential ID</label>
                  <input
                    type="text"
                    value={formData.credential_id}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                    placeholder="e.g. CERT-PY-2023-8891"
                    className="admin-input font-monospace"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Credential / Verification URL</label>
                <input
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  placeholder="https://..."
                  className="admin-input font-monospace"
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-outline">Cancel</button>
                <button type="submit" disabled={actionLoading} className="admin-btn admin-btn-primary">
                  {actionLoading ? 'Saving...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog p-4">
            <h2 className="h5 text-white fw-bold mb-3">Delete Certification</h2>
            <p className="text-secondary small mb-4">Are you sure you want to delete "{deleteTarget.title}"?</p>
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
