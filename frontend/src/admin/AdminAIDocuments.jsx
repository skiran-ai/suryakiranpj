import React, { useState, useEffect } from 'react';
import { Bot, Plus, Edit3, Trash2, Check, AlertTriangle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminAIDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    topic: 'general',
    keywords: [],
    content: '',
    is_active: true,
    priority: 5
  });

  const [keywordInput, setKeywordInput] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getAIDocuments();
      setDocs(data);
    } catch (err) {
      showToast(err.message || 'Failed to load AI knowledge documents.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      topic: 'general',
      keywords: [],
      content: '',
      is_active: true,
      priority: 5
    });
    setModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingItem(doc);
    setFormData({
      title: doc.title || '',
      topic: doc.topic || 'general',
      keywords: Array.isArray(doc.keywords) ? doc.keywords : [],
      content: doc.content || '',
      is_active: Boolean(doc.is_active),
      priority: doc.priority || 0
    });
    setModalOpen(true);
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (!keywordInput.trim()) return;
    const lower = keywordInput.trim().toLowerCase();
    if (!formData.keywords.includes(lower)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, lower]
      }));
    }
    setKeywordInput('');
  };

  const handleRemoveKeyword = (kw) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(item => item !== kw)
    }));
  };

  const handleToggleActive = async (doc) => {
    try {
      await adminApiClient.updateAIDocument(doc.id, { is_active: !doc.is_active });
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, is_active: !doc.is_active } : d));
      showToast(`Document "${doc.title}" status updated.`);
    } catch (err) {
      showToast(err.message || 'Failed to update document status.', 'danger');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Title and Content are required.', 'danger');
      return;
    }

    setActionLoading(true);
    try {
      if (editingItem) {
        await adminApiClient.updateAIDocument(editingItem.id, formData);
        showToast(`Document "${formData.title}" updated.`);
      } else {
        await adminApiClient.createAIDocument(formData);
        showToast(`Document "${formData.title}" created.`);
      }
      setModalOpen(false);
      fetchDocs();
    } catch (err) {
      showToast(err.message || 'Failed to save document.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteAIDocument(deleteTarget.id);
      showToast(`Document deleted.`);
      setDeleteTarget(null);
      setDocs(prev => prev.filter(d => d.id !== deleteTarget.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete document.', 'danger');
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
          <h1 className="h3 text-white fw-bold mb-1">AI Knowledge Documents</h1>
          <p className="text-secondary small font-monospace mb-0">
            Grounding knowledge base for the KIRAN AI chatbot (Gemini 1.5 Flash / Local DB grounding).
          </p>
        </div>
        <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add AI Document
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : docs.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <Bot size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No AI Knowledge Documents</h2>
          <button onClick={openCreateModal} className="admin-btn admin-btn-primary admin-btn-sm mt-3">
            <Plus size={14} /> Add AI Document
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {docs.map(doc => (
            <div key={doc.id} className="admin-card p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-2">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h2 className="h5 text-white fw-bold mb-0">{doc.title}</h2>
                    <span className="admin-badge admin-badge-purple" style={{ fontSize: '0.65rem' }}>
                      {doc.topic_display || doc.topic}
                    </span>
                    <span className="admin-badge admin-badge-info" style={{ fontSize: '0.65rem' }}>
                      Priority: {doc.priority}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(doc)}
                    className={`admin-badge ${doc.is_active ? 'admin-badge-success' : 'admin-badge-danger'} border-0 cursor-pointer`}
                    title="Toggle Active Status"
                  >
                    {doc.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span>{doc.is_active ? 'Active' : 'Disabled'}</span>
                  </button>
                  <button onClick={() => openEditModal(doc)} className="admin-btn admin-btn-outline admin-btn-sm p-1.5">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(doc)} className="admin-btn admin-btn-danger admin-btn-sm p-1.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2 mb-3 small text-secondary" style={{ background: 'rgba(0,0,0,0.2)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {doc.content}
              </div>

              {/* Keywords */}
              <div className="d-flex flex-wrap gap-1 align-items-center">
                <span className="text-muted font-monospace small me-1" style={{ fontSize: '0.7rem' }}>Trigger Keywords:</span>
                {doc.keywords?.map((kw, idx) => (
                  <span key={idx} className="badge bg-secondary bg-opacity-25 text-cyan-400 font-monospace" style={{ fontSize: '0.7rem' }}>
                    {kw}
                  </span>
                ))}
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
              {editingItem ? `Edit: ${editingItem.title}` : 'Add AI Knowledge Document'}
            </h2>

            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div>
                <label className="admin-label">Document Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Technical Skill Matrix & Architecture"
                  className="admin-input"
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-sm-6">
                  <label className="admin-label">Topic Area *</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="admin-select"
                  >
                    <option value="bio">Developer Bio & Background</option>
                    <option value="skill">Skills & Technical Stack</option>
                    <option value="project">Projects & Engineering</option>
                    <option value="cv">CV & Career History</option>
                    <option value="contact">Contact & Socials</option>
                    <option value="services">Services & Contracting</option>
                    <option value="general">General Knowledge</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <label className="admin-label">Priority (Higher matches first)</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    className="admin-input font-monospace"
                  />
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="admin-label">Matching Keywords (Query Intent Tags)</label>
                <div className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="e.g. skills, react, python, api"
                    className="admin-input"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(e); } }}
                  />
                  <button type="button" onClick={handleAddKeyword} className="admin-btn admin-btn-outline">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-1.5">
                  {formData.keywords.map((kw, idx) => (
                    <span key={idx} className="admin-badge admin-badge-info d-flex align-items-center gap-1 font-monospace">
                      <span>{kw}</span>
                      <button type="button" onClick={() => handleRemoveKeyword(kw)} className="btn btn-link p-0 text-white">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="admin-label">Document Content (Grounded Knowledge) *</label>
                <textarea
                  rows="6"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Accurate factual details to feed the AI chatbot..."
                  className="admin-textarea"
                  required
                />
              </div>

              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="docActiveToggle"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label className="form-check-label text-white small" htmlFor="docActiveToggle">
                  Enable Document in Chatbot Context
                </label>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-outline">Cancel</button>
                <button type="submit" disabled={actionLoading} className="admin-btn admin-btn-primary">
                  {actionLoading ? 'Saving...' : 'Save Document'}
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
            <h2 className="h5 text-white fw-bold mb-3">Delete Document</h2>
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
