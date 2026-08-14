import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Edit3, Trash2, Check, AlertTriangle } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    metric: '',
    date: '2023-04-30',
    order: 0
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getAchievements();
      setAchievements(Array.isArray(data) ? data : (data.achievements || []));
    } catch (err) {
      showToast(err.message || 'Failed to load achievements.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      metric: '',
      date: new Date().toISOString().split('T')[0],
      order: achievements.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      metric: item.metric || '',
      date: item.date || '',
      order: item.order || 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Achievement title is required.', 'danger');
      return;
    }

    setActionLoading(true);
    try {
      if (editingItem) {
        await adminApiClient.updateAchievement(editingItem.id, formData);
        showToast(`Achievement updated.`);
      } else {
        await adminApiClient.createAchievement(formData);
        showToast(`Achievement created.`);
      }
      setModalOpen(false);
      fetchAchievements();
    } catch (err) {
      showToast(err.message || 'Failed to save achievement.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteAchievement(deleteTarget.id);
      showToast(`Achievement deleted.`);
      setDeleteTarget(null);
      setAchievements(prev => prev.filter(a => a.id !== deleteTarget.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete achievement.', 'danger');
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
          <h1 className="h3 text-white fw-bold mb-1">Key Achievements</h1>
          <p className="text-secondary small font-monospace mb-0">
            Showcase honors, university distinctions, and major engineering awards.
          </p>
        </div>
        <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Achievement
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : achievements.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <Trophy size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No Achievements Recorded</h2>
          <button onClick={openCreateModal} className="admin-btn admin-btn-primary admin-btn-sm mt-3">
            <Plus size={14} /> Add Achievement
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {achievements.map(ach => (
            <div key={ach.id} className="col-md-6">
              <div className="admin-card h-100 d-flex flex-column justify-content-between p-4">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    {ach.metric && (
                      <span className="admin-badge admin-badge-warning">{ach.metric}</span>
                    )}
                    {ach.date && (
                      <span className="text-muted font-monospace small">{ach.date}</span>
                    )}
                  </div>

                  <h2 className="h6 text-white fw-bold mb-2">{ach.title}</h2>
                  <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                    {ach.description}
                  </p>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top border-secondary border-opacity-25">
                  <button onClick={() => openEditModal(ach)} className="admin-btn admin-btn-outline admin-btn-sm">
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(ach)} className="admin-btn admin-btn-danger admin-btn-sm">
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
              {editingItem ? `Edit: ${editingItem.title}` : 'Add Achievement'}
            </h2>

            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div>
                <label className="admin-label">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. B.Sc. Computer Science Graduate with Honors"
                  className="admin-input"
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-sm-6">
                  <label className="admin-label">Metric / Badge</label>
                  <input
                    type="text"
                    value={formData.metric}
                    onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                    placeholder="e.g. First Class Honors"
                    className="admin-input"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="admin-label">Date</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details of the achievement..."
                  className="admin-textarea"
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-outline">Cancel</button>
                <button type="submit" disabled={actionLoading} className="admin-btn admin-btn-primary">
                  {actionLoading ? 'Saving...' : 'Save Achievement'}
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
            <h2 className="h5 text-white fw-bold mb-3">Delete Achievement</h2>
            <p className="text-secondary small mb-4">Are you sure you want to delete this achievement?</p>
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
