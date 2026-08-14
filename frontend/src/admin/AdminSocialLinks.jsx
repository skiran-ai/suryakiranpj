import React, { useState, useEffect } from 'react';
import { Share2, Plus, Edit3, Trash2, Check, AlertTriangle, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminSocialLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon_name: 'Globe',
    order: 0,
    is_visible: true
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSocials = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getSocialLinks();
      setLinks(data);
    } catch (err) {
      showToast(err.message || 'Failed to load social links.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      platform: '',
      url: '',
      icon_name: 'Globe',
      order: links.length + 1,
      is_visible: true
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      platform: item.platform || '',
      url: item.url || '',
      icon_name: item.icon_name || 'Globe',
      order: item.order || 0,
      is_visible: Boolean(item.is_visible)
    });
    setModalOpen(true);
  };

  const handleToggleVisible = async (link) => {
    try {
      await adminApiClient.updateSocialLink(link.id, { is_visible: !link.is_visible });
      setLinks(prev => prev.map(l => l.id === link.id ? { ...l, is_visible: !link.is_visible } : l));
      showToast(`Link "${link.platform}" visibility updated.`);
    } catch (err) {
      showToast(err.message || 'Failed to update visibility.', 'danger');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.platform.trim() || !formData.url.trim()) {
      showToast('Platform and URL are required.', 'danger');
      return;
    }

    setActionLoading(true);
    try {
      if (editingItem) {
        await adminApiClient.updateSocialLink(editingItem.id, formData);
        showToast(`Social link "${formData.platform}" updated.`);
      } else {
        await adminApiClient.createSocialLink(formData);
        showToast(`Social link "${formData.platform}" created.`);
      }
      setModalOpen(false);
      fetchSocials();
    } catch (err) {
      showToast(err.message || 'Failed to save social link.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteSocialLink(deleteTarget.id);
      showToast(`Social link deleted.`);
      setDeleteTarget(null);
      setLinks(prev => prev.filter(l => l.id !== deleteTarget.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete social link.', 'danger');
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
          <h1 className="h3 text-white fw-bold mb-1">Social & Web Links</h1>
          <p className="text-secondary small font-monospace mb-0">
            Manage links to your GitHub, LinkedIn, Instagram, Email, and developer channels.
          </p>
        </div>
        <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Social Link
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : links.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <Share2 size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No Social Links Found</h2>
          <button onClick={openCreateModal} className="admin-btn admin-btn-primary admin-btn-sm mt-3">
            <Plus size={14} /> Add Social Link
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {links.map(link => (
            <div key={link.id} className="col-md-6">
              <div className="admin-card h-100 d-flex flex-column justify-content-between p-4">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="admin-badge admin-badge-info font-monospace">{link.platform}</span>
                    <button
                      onClick={() => handleToggleVisible(link)}
                      className={`admin-badge ${link.is_visible ? 'admin-badge-success' : 'admin-badge-danger'} border-0 cursor-pointer`}
                      title="Toggle Visibility"
                    >
                      {link.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{link.is_visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-inline-flex align-items-center gap-1 text-white text-decoration-none small text-truncate mb-2 hover-cyan"
                    style={{ maxWidth: '100%' }}
                  >
                    <span className="text-truncate">{link.url}</span>
                    <ExternalLink size={13} className="flex-shrink-0" />
                  </a>
                  <div className="text-muted font-monospace small">Icon: {link.icon_name} • Order: #{link.order}</div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top border-secondary border-opacity-25">
                  <button onClick={() => openEditModal(link)} className="admin-btn admin-btn-outline admin-btn-sm">
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(link)} className="admin-btn admin-btn-danger admin-btn-sm">
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
              {editingItem ? `Edit: ${editingItem.platform}` : 'Add Social Link'}
            </h2>

            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div>
                <label className="admin-label">Platform Name *</label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="e.g. GitHub, LinkedIn, Instagram, Discord"
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="admin-label">Destination URL *</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="admin-input font-monospace"
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-sm-6">
                  <label className="admin-label">Icon Name (Lucide)</label>
                  <input
                    type="text"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    placeholder="e.g. Github, Linkedin, Instagram, Mail"
                    className="admin-input font-monospace"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="admin-label">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="admin-input font-monospace"
                  />
                </div>
                <div className="col-12 mt-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isVisibleToggle"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    />
                    <label className="form-check-label text-white small" htmlFor="isVisibleToggle">
                      Show Link on Public Portfolio
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-outline">Cancel</button>
                <button type="submit" disabled={actionLoading} className="admin-btn admin-btn-primary">
                  {actionLoading ? 'Saving...' : 'Save Link'}
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
            <h2 className="h5 text-white fw-bold mb-3">Delete Social Link</h2>
            <p className="text-secondary small mb-4">Are you sure you want to delete the link to "{deleteTarget.platform}"?</p>
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
