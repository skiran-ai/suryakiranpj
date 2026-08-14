import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit3, Trash2, Check, AlertTriangle } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminEducation() {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_year: 2020,
    end_year: 2023,
    grade: 'First Class',
    description: '',
    order: 0
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getEducation();
      setEducationList(Array.isArray(data) ? data : (data.education || []));
    } catch (err) {
      showToast(err.message || 'Failed to load education records.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      institution: '',
      degree: '',
      field_of_study: '',
      start_year: 2020,
      end_year: 2023,
      grade: '',
      description: '',
      order: educationList.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      institution: item.institution || '',
      degree: item.degree || '',
      field_of_study: item.field_of_study || '',
      start_year: item.start_year || 2020,
      end_year: item.end_year || 2023,
      grade: item.grade || '',
      description: item.description || '',
      order: item.order || 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.institution.trim() || !formData.degree.trim()) {
      showToast('Institution and Degree are required.', 'danger');
      return;
    }

    setActionLoading(true);
    try {
      if (editingItem) {
        await adminApiClient.updateEducation(editingItem.id, formData);
        showToast(`Education at "${formData.institution}" updated.`);
      } else {
        await adminApiClient.createEducation(formData);
        showToast(`Education at "${formData.institution}" created.`);
      }
      setModalOpen(false);
      fetchEducation();
    } catch (err) {
      showToast(err.message || 'Failed to save education record.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteEducation(deleteTarget.id);
      showToast(`Education record deleted.`);
      setDeleteTarget(null);
      setEducationList(prev => prev.filter(e => e.id !== deleteTarget.id));
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
          <h1 className="h3 text-white fw-bold mb-1">Education Management</h1>
          <p className="text-secondary small font-monospace mb-0">
            Maintain university degrees and educational qualifications shown on your public CV.
          </p>
        </div>
        <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Education
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : educationList.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <GraduationCap size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No Education Records Found</h2>
          <button onClick={openCreateModal} className="admin-btn admin-btn-primary admin-btn-sm mt-3">
            <Plus size={14} /> Add Education
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {educationList.map(item => (
            <div key={item.id} className="col-md-6">
              <div className="admin-card h-100 d-flex flex-column justify-content-between p-4">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="admin-badge admin-badge-info">
                      {item.start_year} - {item.end_year}
                    </span>
                    {item.grade && (
                      <span className="admin-badge admin-badge-success">{item.grade}</span>
                    )}
                  </div>

                  <h2 className="h6 text-white fw-bold mb-1">{item.degree}</h2>
                  <div className="text-cyan-400 small mb-2">{item.institution}</div>
                  <div className="text-muted small mb-2 font-monospace" style={{ fontSize: '0.75rem' }}>{item.field_of_study}</div>

                  {item.description && (
                    <p className="text-secondary small mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-3 mt-3 border-top border-secondary border-opacity-25">
                  <button onClick={() => openEditModal(item)} className="admin-btn admin-btn-outline admin-btn-sm">
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="admin-btn admin-btn-danger admin-btn-sm">
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
              {editingItem ? `Edit: ${editingItem.degree}` : 'Add Education Record'}
            </h2>

            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div>
                <label className="admin-label">Institution / University *</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. MG University"
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="admin-label">Degree Name *</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="admin-label">Field of Study</label>
                <input
                  type="text"
                  value={formData.field_of_study}
                  onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                  placeholder="e.g. Computer Science & Software Engineering"
                  className="admin-input"
                />
              </div>

              <div className="row g-2">
                <div className="col-sm-4">
                  <label className="admin-label">Start Year</label>
                  <input
                    type="number"
                    value={formData.start_year}
                    onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) || 2020 })}
                    className="admin-input font-monospace"
                  />
                </div>
                <div className="col-sm-4">
                  <label className="admin-label">End Year</label>
                  <input
                    type="number"
                    value={formData.end_year}
                    onChange={(e) => setFormData({ ...formData, end_year: parseInt(e.target.value) || 2023 })}
                    className="admin-input font-monospace"
                  />
                </div>
                <div className="col-sm-4">
                  <label className="admin-label">Grade / Distinction</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g. First Class"
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Description / Highlights</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key coursework, algorithms, software engineering..."
                  className="admin-textarea"
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-outline">Cancel</button>
                <button type="submit" disabled={actionLoading} className="admin-btn admin-btn-primary">
                  {actionLoading ? 'Saving...' : 'Save Education'}
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
            <h2 className="h5 text-white fw-bold mb-3">Delete Education Record</h2>
            <p className="text-secondary small mb-4">Are you sure you want to delete this record?</p>
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
