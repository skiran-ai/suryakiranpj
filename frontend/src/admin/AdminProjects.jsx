import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, Plus, Search, Filter, Edit3, Trash2, Globe, 
  Github, Check, X, AlertTriangle, Eye, EyeOff, Star
} from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await adminApiClient.getProjects();
      setProjects(data);
    } catch (err) {
      showToast(err.message || 'Failed to load projects.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleToggleStatus = async (project) => {
    const newStatus = project.status === 'Published' ? 'Draft' : 'Published';
    try {
      await adminApiClient.updateProject(project.id, { status: newStatus });
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: newStatus } : p));
      showToast(`Project "${project.title}" set to ${newStatus}.`);
    } catch (err) {
      showToast(err.message || 'Failed to update publication status.', 'danger');
    }
  };

  const handleToggleFeatured = async (project) => {
    const newFeatured = !project.featured;
    try {
      await adminApiClient.updateProject(project.id, { featured: newFeatured });
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, featured: newFeatured } : p));
      showToast(`Project "${project.title}" ${newFeatured ? 'marked as Featured' : 'unfeatured'}.`);
    } catch (err) {
      showToast(err.message || 'Failed to update featured flag.', 'danger');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await adminApiClient.deleteProject(deleteTarget.id);
      setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
      showToast(`Project "${deleteTarget.title}" was deleted permanently.`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete project.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const categories = ['All', 'Full Stack', 'Backend', 'Frontend', 'AI/ML', 'DevOps'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = !search || 
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug?.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="d-flex flex-column gap-4">
      {/* Toast Notification */}
      {notification && (
        <div className={`admin-toast ${notification.type === 'danger' ? 'bg-danger text-white' : 'bg-success text-white'}`}>
          {notification.type === 'danger' ? <AlertTriangle size={18} /> : <Check size={18} />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h1 className="h3 text-white fw-bold mb-1">Projects Management</h1>
          <p className="text-secondary small font-monospace mb-0">
            Create, edit, publish, or remove projects displayed on the public portfolio.
          </p>
        </div>
        <Link to="/admin/projects/new" className="admin-btn admin-btn-primary">
          <Plus size={16} />
          <span>Add Project</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-card p-3 d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between">
        <div className="position-relative w-100" style={{ maxWidth: '380px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, slug, stack..."
            className="admin-input ps-5"
          />
          <Search size={16} className="position-absolute top-50 translate-middle-y ms-3 text-secondary" />
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2 w-100 justify-content-md-end">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select w-auto"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
          <p className="text-secondary mt-3 font-monospace small">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <FolderGit2 size={40} className="text-secondary mb-3 opacity-50" />
          <h2 className="h6 text-white mb-1">No Projects Found</h2>
          <p className="text-secondary small mb-3">No project records matching your search and filter criteria.</p>
          <Link to="/admin/projects/new" className="admin-btn admin-btn-primary admin-btn-sm">
            <Plus size={14} /> Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden">
          <div className="admin-table-container border-0">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Thumbnail & Details</th>
                  <th>Category</th>
                  <th>Tech Stack</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    {/* Title & Slug */}
                    <td style={{ minWidth: '240px' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-3 overflow-hidden flex-shrink-0"
                          style={{ width: '56px', height: '44px', background: '#1e293b' }}
                        >
                          <img 
                            src={project.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'} 
                            alt={project.title}
                            className="w-100 h-100 object-fit-cover"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c"; }}
                          />
                        </div>
                        <div>
                          <div className="fw-bold text-white small">{project.title}</div>
                          <div className="text-muted font-monospace" style={{ fontSize: '0.725rem' }}>
                            /{project.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="admin-badge admin-badge-purple">
                        {project.category}
                      </span>
                    </td>

                    {/* Tech badges */}
                    <td style={{ maxWidth: '200px' }}>
                      <div className="d-flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="badge bg-secondary bg-opacity-25 font-monospace text-cyan-400" style={{ fontSize: '0.7rem' }}>
                            {t}
                          </span>
                        ))}
                        {project.technologies?.length > 3 && (
                          <span className="badge bg-secondary bg-opacity-25 text-secondary font-monospace" style={{ fontSize: '0.7rem' }}>
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status with Toggle */}
                    <td>
                      <button
                        onClick={() => handleToggleStatus(project)}
                        className={`admin-badge ${project.status === 'Published' ? 'admin-badge-success' : 'admin-badge-warning'} border-0 cursor-pointer`}
                        title={`Click to ${project.status === 'Published' ? 'Unpublish' : 'Publish'}`}
                      >
                        {project.status === 'Published' ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{project.status}</span>
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td>
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`btn btn-sm p-1 rounded-circle border-0 ${project.featured ? 'text-warning' : 'text-secondary opacity-50'}`}
                        title="Toggle Featured"
                      >
                        <Star size={16} fill={project.featured ? '#f59e0b' : 'none'} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1.5">
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="admin-btn admin-btn-outline admin-btn-sm p-1.5"
                          title="Edit Project"
                        >
                          <Edit3 size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="admin-btn admin-btn-danger admin-btn-sm p-1.5"
                          title="Delete Project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog p-4">
            <div className="d-flex align-items-center gap-3 mb-3 text-danger">
              <div className="rounded-circle p-2 bg-danger bg-opacity-25">
                <AlertTriangle size={24} />
              </div>
              <h2 className="h5 text-white fw-bold mb-0">Confirm Project Deletion</h2>
            </div>
            <p className="text-secondary small mb-4">
              Are you sure you want to permanently delete <strong className="text-white">"{deleteTarget.title}"</strong>? 
              This will remove the record from Render PostgreSQL and it will immediately disappear from your public portfolio.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setDeleteTarget(null)}
                className="admin-btn admin-btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteConfirm}
                className="admin-btn admin-btn-danger"
              >
                {actionLoading ? 'Deleting...' : 'Delete Project 🗑️'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
