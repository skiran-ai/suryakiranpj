import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Edit3, Trash2, Check, AlertTriangle, Layers } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    icon_name: 'Layers',
    technologies: ['Python', 'Django', 'React.js'],
    order: 0
  });

  const [techInput, setTechInput] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getServices();
      setServices(data);
    } catch (err) {
      showToast(err.message || 'Failed to load services.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      short_description: '',
      full_description: '',
      icon_name: 'Layers',
      technologies: ['Python', 'Django', 'React.js'],
      order: services.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      icon_name: service.icon_name || 'Layers',
      technologies: Array.isArray(service.technologies) ? service.technologies : [],
      order: service.order || 0
    });
    setModalOpen(true);
  };

  const handleAddTech = (e) => {
    e.preventDefault();
    if (!techInput.trim()) return;
    if (!formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
    }
    setTechInput('');
  };

  const handleRemoveTech = (t) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(item => item !== t)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Service title is required.', 'danger');
      return;
    }

    setActionLoading(true);
    try {
      if (editingService) {
        await adminApiClient.updateService(editingService.id, formData);
        showToast(`Service "${formData.title}" updated.`);
      } else {
        await adminApiClient.createService(formData);
        showToast(`Service "${formData.title}" created.`);
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      showToast(err.message || 'Failed to save service.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteService(deleteTarget.id);
      showToast(`Service "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      setServices(prev => prev.filter(s => s.id !== deleteTarget.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete service.', 'danger');
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
          <h1 className="h3 text-white fw-bold mb-1">Services Management</h1>
          <p className="text-secondary small font-monospace mb-0">
            Define contracting services, consulting specialties, and full-stack offerings.
          </p>
        </div>
        <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <Wrench size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No Services Found</h2>
          <button onClick={openCreateModal} className="admin-btn admin-btn-primary admin-btn-sm mt-3">
            <Plus size={14} /> Add Service
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {services.map(srv => (
            <div key={srv.id} className="col-md-6 col-lg-4">
              <div className="admin-card h-100 d-flex flex-column justify-content-between p-4">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="rounded-3 p-2 bg-info bg-opacity-10 text-cyan-400">
                      <Layers size={20} />
                    </div>
                    <span className="text-muted font-monospace small">Order: #{srv.order}</span>
                  </div>

                  <h2 className="h6 text-white fw-bold mb-2">{srv.title}</h2>
                  <p className="text-secondary small mb-3">{srv.short_description}</p>
                  
                  {srv.full_description && (
                    <p className="text-muted small mb-3" style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>
                      {srv.full_description}
                    </p>
                  )}

                  {/* Tech stack */}
                  <div className="d-flex flex-wrap gap-1.5 mb-3">
                    {srv.technologies?.map((t, idx) => (
                      <span key={idx} className="admin-badge admin-badge-info" style={{ fontSize: '0.68rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-25">
                  <button
                    onClick={() => openEditModal(srv)}
                    className="admin-btn admin-btn-outline admin-btn-sm"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(srv)}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                  >
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
              {editingService ? `Edit: ${editingService.title}` : 'Add New Service'}
            </h2>

            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div>
                <label className="admin-label">Service Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack Web Development"
                  className="admin-input"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="admin-label">Short Description *</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="e.g. End-to-end web application development with Django and React."
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="admin-label">Full Description</label>
                <textarea
                  rows="3"
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="Detailed breakdown of consulting & engineering scope..."
                  className="admin-textarea"
                />
              </div>

              <div className="row g-2">
                <div className="col-sm-6">
                  <label className="admin-label">Icon Name (Lucide)</label>
                  <input
                    type="text"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    placeholder="e.g. Layers, Globe, Sparkles"
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
              </div>

              {/* Technologies */}
              <div>
                <label className="admin-label">Technologies (Tag List)</label>
                <div className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. Python, Django, React.js"
                    className="admin-input"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(e); } }}
                  />
                  <button type="button" onClick={handleAddTech} className="admin-btn admin-btn-outline">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-1.5">
                  {formData.technologies.map((t, idx) => (
                    <span key={idx} className="admin-badge admin-badge-info d-flex align-items-center gap-1">
                      <span>{t}</span>
                      <button type="button" onClick={() => handleRemoveTech(t)} className="btn btn-link p-0 text-white">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="admin-btn admin-btn-primary">
                  {actionLoading ? 'Saving...' : 'Save Service'}
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
            <h2 className="h5 text-white fw-bold mb-3">Delete Service</h2>
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
