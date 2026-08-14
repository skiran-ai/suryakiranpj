import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Edit3, Trash2, Check, AlertTriangle, Star, Search } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    badge: '',
    icon_name: 'Code',
    proficiency: 90,
    is_featured: true,
    order: 0
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getSkills();
      setSkills(Array.isArray(data) ? data : (data.all || []));
    } catch (err) {
      showToast(err.message || 'Failed to load skills.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: activeCat !== 'All' ? activeCat : 'frontend',
      badge: '',
      icon_name: 'Code',
      proficiency: 90,
      is_featured: true,
      order: skills.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'frontend',
      badge: skill.badge || '',
      icon_name: skill.icon_name || 'Code',
      proficiency: skill.proficiency || 90,
      is_featured: Boolean(skill.is_featured),
      order: skill.order || 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Skill name is required.', 'danger');
      return;
    }

    setActionLoading(true);
    try {
      if (editingSkill) {
        await adminApiClient.updateSkill(editingSkill.id, formData);
        showToast(`Skill "${formData.name}" updated successfully!`);
      } else {
        await adminApiClient.createSkill(formData);
        showToast(`Skill "${formData.name}" created successfully!`);
      }
      setModalOpen(false);
      fetchSkills();
    } catch (err) {
      showToast(err.message || 'Failed to save skill.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteSkill(deleteTarget.id);
      showToast(`Skill "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      setSkills(prev => prev.filter(s => s.id !== deleteTarget.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete skill.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const categories = [
    { key: 'All', label: 'All Skills' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'tools', label: 'Tools & DevOps' },
    { key: 'development', label: 'Core Development' }
  ];

  const filteredSkills = activeCat === 'All' 
    ? skills 
    : skills.filter(s => s.category?.toLowerCase() === activeCat.toLowerCase());

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
          <h1 className="h3 text-white fw-bold mb-1">Skills Management</h1>
          <p className="text-secondary small font-monospace mb-0">
            Configure technical capabilities and proficiency ratings displayed in the skills matrix.
          </p>
        </div>
        <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="admin-card p-3 d-flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setActiveCat(c.key)}
            className={`admin-btn admin-btn-sm ${activeCat === c.key ? 'admin-btn-primary' : 'admin-btn-outline'}`}
          >
            {c.label} ({c.key === 'All' ? skills.length : skills.filter(s => s.category?.toLowerCase() === c.key.toLowerCase()).length})
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <Cpu size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No Skills Found</h2>
          <p className="text-secondary small mb-3">No skills listed in this category yet.</p>
          <button onClick={openCreateModal} className="admin-btn admin-btn-primary admin-btn-sm">
            <Plus size={14} /> Add Skill
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {filteredSkills.map(skill => (
            <div key={skill.id} className="col-md-6 col-lg-4">
              <div className="admin-card h-100 d-flex flex-column justify-content-between p-3 position-relative">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fw-bold text-white small">{skill.name}</div>
                    <span className="admin-badge admin-badge-purple" style={{ fontSize: '0.65rem' }}>
                      {skill.category_display || skill.category}
                    </span>
                  </div>

                  {skill.badge && (
                    <div className="text-muted small mb-2" style={{ fontSize: '0.75rem' }}>
                      {skill.badge}
                    </div>
                  )}

                  {/* Proficiency Bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between text-secondary font-monospace mb-1" style={{ fontSize: '0.7rem' }}>
                      <span>Proficiency</span>
                      <span className="text-cyan-400 fw-bold">{skill.proficiency}%</span>
                    </div>
                    <div className="progress" style={{ height: '5px', background: 'rgba(255,255,255,0.08)' }}>
                      <div 
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${skill.proficiency}%`, background: 'linear-gradient(90deg, #38bdf8, #818cf8)' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
                  <span className="text-muted font-monospace" style={{ fontSize: '0.7rem' }}>
                    Order: #{skill.order} {skill.is_featured ? '• ★ Featured' : ''}
                  </span>
                  <div className="d-flex gap-1">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="admin-btn admin-btn-outline admin-btn-sm p-1.5"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(skill)}
                      className="admin-btn admin-btn-danger admin-btn-sm p-1.5"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog p-4">
            <h2 className="h5 text-white fw-bold mb-3 font-monospace">
              {editingSkill ? `Edit Skill: ${editingSkill.name}` : 'Add New Technical Skill'}
            </h2>

            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div>
                <label className="admin-label">Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Django REST Framework"
                  className="admin-input"
                  required
                  autoFocus
                />
              </div>

              <div className="row g-2">
                <div className="col-sm-6">
                  <label className="admin-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="admin-select"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="tools">Tools & DevOps</option>
                    <option value="development">Core Development</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <label className="admin-label">Icon Name (Lucide)</label>
                  <input
                    type="text"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    placeholder="e.g. Database, Terminal, Cpu"
                    className="admin-input font-monospace"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Badge / Subtitle</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. RESTful Endpoints & Serializers"
                  className="admin-input"
                />
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="admin-label mb-0">Proficiency: {formData.proficiency}%</label>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  className="form-range w-100"
                />
              </div>

              <div className="row g-2 align-items-center">
                <div className="col-sm-6">
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="admin-input font-monospace"
                  />
                </div>
                <div className="col-sm-6 pt-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="skillFeatured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    <label className="form-check-label text-white small" htmlFor="skillFeatured">
                      Featured Skill
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="admin-btn admin-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="admin-btn admin-btn-primary"
                >
                  {actionLoading ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog p-4">
            <div className="d-flex align-items-center gap-3 mb-3 text-danger">
              <AlertTriangle size={24} />
              <h2 className="h5 text-white fw-bold mb-0">Delete Skill</h2>
            </div>
            <p className="text-secondary small mb-4">
              Are you sure you want to delete <strong className="text-white">"{deleteTarget.name}"</strong>?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="admin-btn admin-btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDelete}
                className="admin-btn admin-btn-danger"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
