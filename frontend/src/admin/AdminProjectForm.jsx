import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FolderGit2, Save, ArrowLeft, Image as ImageIcon, Sparkles, 
  Check, AlertCircle, Plus, Trash2, Globe, Github, Terminal, Cpu
} from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Full Stack',
    short_description: '',
    detailed_description: '',
    problem_statement: '',
    solution_architecture: '',
    my_role: 'Lead Full Stack Developer',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    github_url: 'https://github.com/skiran-ai',
    live_url: '',
    technologies: ['Python', 'Django', 'React.js'],
    features: ['Authentication & authorization', 'Dynamic state management'],
    featured: true,
    order: 1,
    status: 'Published',
    frontend_tech: 'React 18, Vite, Bootstrap 5',
    backend_tech: 'Python 3.11, Django 4.2, DRF',
    database_tech: 'PostgreSQL / SQLite ORM',
    deployment_tech: 'Render API + Netlify CDN'
  });

  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Preset Unsplash Project Images for quick selection
  const imagePresets = [
    { label: 'Code Terminal', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
    { label: 'E-Commerce / Shopping', url: 'https://images.unsplash.com/photo-1556742049-0a67d577c77e?auto=format&fit=crop&w=800&q=80' },
    { label: 'API Backend', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80' },
    { label: 'Data Analytics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
    { label: 'Developer Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
    { label: 'Task Dashboard', url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80' },
  ];

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      adminApiClient.getProject(id)
        .then((data) => {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            category: data.category || 'Full Stack',
            short_description: data.short_description || '',
            detailed_description: data.detailed_description || '',
            problem_statement: data.problem_statement || '',
            solution_architecture: data.solution_architecture || '',
            my_role: data.my_role || '',
            image_url: data.image_url || '',
            github_url: data.github_url || '',
            live_url: data.live_url || '',
            technologies: Array.isArray(data.technologies) ? data.technologies : [],
            features: Array.isArray(data.features) ? data.features : [],
            featured: Boolean(data.featured),
            order: data.order || 0,
            status: data.status || 'Published',
            frontend_tech: data.frontend_tech || '',
            backend_tech: data.backend_tech || '',
            database_tech: data.database_tech || '',
            deployment_tech: data.deployment_tech || ''
          });
        })
        .catch((err) => {
          setError(err.message || 'Failed to load project details.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug }));
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

  const handleRemoveTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== techToRemove)
    }));
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!featureInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.title.trim() || !formData.slug.trim()) {
      setError('Title and Slug are required fields.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await adminApiClient.updateProject(id, formData);
        setSuccessMsg('Project updated successfully in PostgreSQL!');
      } else {
        await adminApiClient.createProject(formData);
        setSuccessMsg('Project created successfully in PostgreSQL!');
      }
      setTimeout(() => {
        navigate('/admin/projects');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save project.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info" role="status"></div>
        <p className="text-secondary mt-3 font-monospace small">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Breadcrumb & Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <Link to="/admin/projects" className="admin-btn admin-btn-outline admin-btn-sm p-2 rounded-circle">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="h4 text-white fw-bold mb-0">
              {isEditing ? `Edit: ${formData.title}` : 'Create New Project'}
            </h1>
            <div className="text-muted font-monospace small">PostgreSQL Dynamic Record</div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="admin-btn admin-btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            disabled={saving}
            className="admin-btn admin-btn-primary"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : (isEditing ? 'Update Project' : 'Publish Project 🚀')}</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="admin-card border-danger text-danger p-3 d-flex align-items-center gap-2 small">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="admin-card border-success text-success p-3 d-flex align-items-center gap-2 small">
          <Check size={18} className="flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form id="project-form" onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        {/* Section 1: General Details */}
        <div className="admin-card p-4">
          <h2 className="h6 text-white fw-bold mb-3 d-flex align-items-center gap-2 font-monospace">
            <FolderGit2 size={16} style={{ color: 'var(--admin-cyan)' }} />
            <span>GENERAL PROJECT DETAILS</span>
          </h2>

          <div className="row g-3">
            {/* Title */}
            <div className="col-md-7">
              <label className="admin-label">Project Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. SwiftCart — Modern E-Commerce Engine"
                className="admin-input"
                required
              />
            </div>

            {/* Slug */}
            <div className="col-md-5">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="admin-label mb-0">URL Slug *</label>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="btn btn-link p-0 text-cyan-400 font-monospace small text-decoration-none"
                >
                  ⚡ Auto Slug
                </button>
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                placeholder="e.g. swiftcart-ecommerce"
                className="admin-input font-monospace"
                required
              />
            </div>

            {/* Category */}
            <div className="col-md-4">
              <label className="admin-label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="admin-select"
              >
                <option value="Full Stack">Full Stack</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="AI/ML">AI / Machine Learning</option>
                <option value="DevOps">DevOps & Cloud</option>
              </select>
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="admin-label">Publication Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="admin-select"
              >
                <option value="Published">Published (Visible Publicly)</option>
                <option value="Draft">Draft (Hidden from Public)</option>
              </select>
            </div>

            {/* Order */}
            <div className="col-md-4">
              <label className="admin-label">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="admin-input font-monospace"
                min="0"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="col-12">
              <div className="form-check form-switch mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="featuredToggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <label className="form-check-label text-white small fw-semibold" htmlFor="featuredToggle">
                  Mark as Featured Project (Highlighted on Home & AI Recruiter mode)
                </label>
              </div>
            </div>

            {/* Short Description */}
            <div className="col-12">
              <label className="admin-label">Short Description (Card Subtitle) *</label>
              <textarea
                rows="2"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Concise 1-2 sentence overview of what the project accomplishes..."
                className="admin-textarea"
                maxLength="300"
                required
              />
            </div>

            {/* Detailed Description */}
            <div className="col-12">
              <label className="admin-label">Detailed Description / Solution Overview</label>
              <textarea
                rows="3"
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                placeholder="Comprehensive technical breakdown shown in the details modal..."
                className="admin-textarea"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Image & Live Previews */}
        <div className="admin-card p-4">
          <h2 className="h6 text-white fw-bold mb-3 d-flex align-items-center gap-2 font-monospace">
            <ImageIcon size={16} style={{ color: 'var(--admin-cyan)' }} />
            <span>PROJECT IMAGE & ASSETS</span>
          </h2>

          <div className="row g-3">
            <div className="col-md-7">
              <label className="admin-label">Project Image URL *</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="admin-input mb-2 font-monospace"
                required
              />

              <div className="small text-secondary mb-2">Or select from high-res developer presets:</div>
              <div className="d-flex flex-wrap gap-1.5">
                {imagePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: preset.url })}
                    className="admin-btn admin-btn-outline admin-btn-sm"
                    style={{ fontSize: '0.725rem' }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Image Preview */}
            <div className="col-md-5">
              <label className="admin-label">Live Image Preview</label>
              <div 
                className="rounded-3 overflow-hidden border border-secondary border-opacity-25 d-flex align-items-center justify-content-center"
                style={{ height: '160px', background: '#0a0d1a' }}
              >
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c"; }}
                  />
                ) : (
                  <span className="text-secondary small font-monospace">No Image URL</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Engineering, Problem & Solution */}
        <div className="admin-card p-4">
          <h2 className="h6 text-white fw-bold mb-3 d-flex align-items-center gap-2 font-monospace">
            <Cpu size={16} style={{ color: 'var(--admin-cyan)' }} />
            <span>ENGINEERING & ARCHITECTURE</span>
          </h2>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="admin-label">Problem Statement *</label>
              <textarea
                rows="3"
                value={formData.problem_statement}
                onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                placeholder="What challenge does this project solve?"
                className="admin-textarea"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="admin-label">Solution Architecture *</label>
              <textarea
                rows="3"
                value={formData.solution_architecture}
                onChange={(e) => setFormData({ ...formData, solution_architecture: e.target.value })}
                placeholder="How is the backend and frontend engineered to solve it?"
                className="admin-textarea"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="admin-label">My Role / Contribution *</label>
              <input
                type="text"
                value={formData.my_role}
                onChange={(e) => setFormData({ ...formData, my_role: e.target.value })}
                placeholder="e.g. Lead Full Stack Developer (Designed schema, API, UI)"
                className="admin-input"
                required
              />
            </div>

            <div className="col-md-3">
              <label className="admin-label">GitHub Repository URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="admin-input font-monospace"
              />
            </div>

            <div className="col-md-3">
              <label className="admin-label">Live Demo URL</label>
              <input
                type="url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                placeholder="https://..."
                className="admin-input font-monospace"
              />
            </div>

            {/* Technologies Tags Builder */}
            <div className="col-12">
              <label className="admin-label">Technologies (JSON Tag List)</label>
              <div className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g. React.js, Django, PostgreSQL, Docker..."
                  className="admin-input"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(e); } }}
                />
                <button type="button" onClick={handleAddTech} className="admin-btn admin-btn-outline">
                  <Plus size={15} /> Add
                </button>
              </div>
              <div className="d-flex flex-wrap gap-1.5">
                {formData.technologies.map((t, idx) => (
                  <span key={idx} className="admin-badge admin-badge-info d-flex align-items-center gap-1.5">
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(t)}
                      className="btn btn-link p-0 text-white opacity-75 hover-opacity-100"
                      style={{ lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features List Builder */}
            <div className="col-12">
              <label className="admin-label">Key Features</label>
              <div className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g. JWT Token Authentication with Refresh Tokens"
                  className="admin-input"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(e); } }}
                />
                <button type="button" onClick={handleAddFeature} className="admin-btn admin-btn-outline">
                  <Plus size={15} /> Add
                </button>
              </div>
              <div className="d-flex flex-column gap-1.5">
                {formData.features.map((f, idx) => (
                  <div key={idx} className="p-2 rounded-2 d-flex align-items-center justify-content-between small" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-white">✓ {f}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="btn btn-link p-0 text-danger"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Technical X-Ray Specifications */}
        <div className="admin-card p-4">
          <h2 className="h6 text-white fw-bold mb-3 d-flex align-items-center gap-2 font-monospace">
            <Sparkles size={16} style={{ color: 'var(--admin-cyan)' }} />
            <span>TECHNICAL X-RAY SPECIFICATIONS</span>
          </h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="admin-label">Frontend Specs</label>
              <input
                type="text"
                value={formData.frontend_tech}
                onChange={(e) => setFormData({ ...formData, frontend_tech: e.target.value })}
                placeholder="React 18, Vite, Bootstrap 5"
                className="admin-input font-monospace"
              />
            </div>
            <div className="col-md-6">
              <label className="admin-label">Backend Specs</label>
              <input
                type="text"
                value={formData.backend_tech}
                onChange={(e) => setFormData({ ...formData, backend_tech: e.target.value })}
                placeholder="Python 3.11, Django 4.2, DRF"
                className="admin-input font-monospace"
              />
            </div>
            <div className="col-md-6">
              <label className="admin-label">Database Specs</label>
              <input
                type="text"
                value={formData.database_tech}
                onChange={(e) => setFormData({ ...formData, database_tech: e.target.value })}
                placeholder="PostgreSQL / SQLite ORM"
                className="admin-input font-monospace"
              />
            </div>
            <div className="col-md-6">
              <label className="admin-label">Deployment Specs</label>
              <input
                type="text"
                value={formData.deployment_tech}
                onChange={(e) => setFormData({ ...formData, deployment_tech: e.target.value })}
                placeholder="Render Web Service + Netlify CDN"
                className="admin-input font-monospace"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="d-flex justify-content-end gap-2 mb-5">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="admin-btn admin-btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : (isEditing ? 'Update Project' : 'Publish Project 🚀')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
