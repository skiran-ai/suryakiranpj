import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit3, Trash2, Check, AlertTriangle, Calendar } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminExperience() {
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: 'Kerala, India / Remote',
    start_date: '2023-06-01',
    end_date: '',
    is_current: true,
    summary: '',
    bullet_points: [],
    order: 0
  });

  const [bulletInput, setBulletInput] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getExperience();
      setExperienceList(data);
    } catch (err) {
      showToast(err.message || 'Failed to load experience.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      company: '',
      role: '',
      location: 'Kerala, India / Remote',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      is_current: true,
      summary: '',
      bullet_points: [],
      order: experienceList.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      company: item.company || '',
      role: item.role || '',
      location: item.location || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      is_current: Boolean(item.is_current),
      summary: item.summary || '',
      bullet_points: Array.isArray(item.bullet_points) ? item.bullet_points : [],
      order: item.order || 0
    });
    setModalOpen(true);
  };

  const handleAddBullet = (e) => {
    e.preventDefault();
    if (!bulletInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      bullet_points: [...prev.bullet_points, bulletInput.trim()]
    }));
    setBulletInput('');
  };

  const handleRemoveBullet = (idx) => {
    setFormData(prev => ({
      ...prev,
      bullet_points: prev.bullet_points.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) {
      showToast('Company and Role are required.', 'danger');
      return;
    }

    setActionLoading(true);
    const payload = {
      ...formData,
      end_date: formData.is_current ? null : (formData.end_date || null)
    };

    try {
      if (editingItem) {
        await adminApiClient.updateExperience(editingItem.id, payload);
        showToast(`Experience at "${formData.company}" updated.`);
      } else {
        await adminApiClient.createExperience(payload);
        showToast(`Experience at "${formData.company}" created.`);
      }
      setModalOpen(false);
      fetchExperience();
    } catch (err) {
      showToast(err.message || 'Failed to save experience.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteExperience(deleteTarget.id);
      showToast(`Experience at "${deleteTarget.company}" deleted.`);
      setDeleteTarget(null);
      setExperienceList(prev => prev.filter(e => e.id !== deleteTarget.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete record.', 'danger');
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
          <h1 className="h3 text-white fw-bold mb-1">Experience Management</h1>
          <p className="text-secondary small font-monospace mb-0">
            Maintain your engineering employment history and project consulting track record.
          </p>
        </div>
        <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : experienceList.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <Briefcase size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No Experience Records Found</h2>
          <button onClick={openCreateModal} className="admin-btn admin-btn-primary admin-btn-sm mt-3">
            <Plus size={14} /> Add Experience
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {experienceList.map(item => (
            <div key={item.id} className="admin-card p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-2">
                <div>
                  <h2 className="h5 text-white fw-bold mb-1">{item.role}</h2>
                  <div className="text-cyan-400 fw-semibold small">{item.company} • <span className="text-muted font-monospace">{item.location}</span></div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="admin-badge admin-badge-info">
                    <Calendar size={12} />
                    <span>{item.start_date} → {item.is_current ? 'Present' : (item.end_date || 'N/A')}</span>
                  </span>
                  <button onClick={() => openEditModal(item)} className="admin-btn admin-btn-outline admin-btn-sm p-1.5">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="admin-btn admin-btn-danger admin-btn-sm p-1.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {item.summary && <p className="text-secondary small mb-3">{item.summary}</p>}

              {item.bullet_points?.length > 0 && (
                <ul className="text-secondary small mb-0 ps-3">
                  {item.bullet_points.map((b, idx) => (
                    <li key={idx} className="mb-1">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog p-4">
            <h2 className="h5 text-white fw-bold mb-3 font-monospace">
              {editingItem ? `Edit Experience: ${editingItem.role}` : 'Add Experience'}
            </h2>

            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div className="row g-2">
                <div className="col-sm-6">
                  <label className="admin-label">Company / Organization *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Independent Software Engineering"
                    className="admin-input"
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label className="admin-label">Job Role / Title *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Python Full Stack Developer"
                    className="admin-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Kerala, India / Remote"
                  className="admin-input"
                />
              </div>

              <div className="row g-2 align-items-center">
                <div className="col-sm-6">
                  <label className="admin-label">Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label className="admin-label">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date || ''}
                    disabled={formData.is_current}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="col-12 mt-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isCurrentRole"
                      checked={formData.is_current}
                      onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                    />
                    <label className="form-check-label text-white small" htmlFor="isCurrentRole">
                      Currently Working in this Role
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="admin-label">Summary</label>
                <textarea
                  rows="2"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Overview of core technical responsibilities..."
                  className="admin-textarea"
                />
              </div>

              {/* Bullet Points */}
              <div>
                <label className="admin-label">Key Achievements / Bullets</label>
                <div className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                    placeholder="Add bullet point item..."
                    className="admin-input"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBullet(e); } }}
                  />
                  <button type="button" onClick={handleAddBullet} className="admin-btn admin-btn-outline">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="d-flex flex-column gap-1">
                  {formData.bullet_points.map((b, idx) => (
                    <div key={idx} className="p-2 rounded d-flex align-items-center justify-content-between small" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <span className="text-white">✓ {b}</span>
                      <button type="button" onClick={() => handleRemoveBullet(idx)} className="btn btn-link p-0 text-danger">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-outline">Cancel</button>
                <button type="submit" disabled={actionLoading} className="admin-btn admin-btn-primary">
                  {actionLoading ? 'Saving...' : 'Save Experience'}
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
            <h2 className="h5 text-white fw-bold mb-3">Delete Experience</h2>
            <p className="text-secondary small mb-4">Are you sure you want to delete experience at "{deleteTarget.company}"?</p>
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
