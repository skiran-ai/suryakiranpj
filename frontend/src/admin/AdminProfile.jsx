import React, { useState, useEffect } from 'react';
import { UserCircle, Save, Check, AlertTriangle, User, Mail, MapPin, Globe, FileText, CheckCircle2 } from 'lucide-react';
import { adminApiClient } from '../services/adminApiClient';

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: 'Suryakiran P. J.',
    role: 'Python Full Stack Developer',
    tagline: '',
    summary: '',
    email: 'suryakiranpjineesh@gmail.com',
    location: 'Kerala, India',
    avatar_url: '',
    github_url: 'https://github.com/skiran-ai',
    linkedin_url: 'https://www.linkedin.com/in/surya-kiran-967659351',
    instagram_url: 'https://www.instagram.com/jstt.kiran',
    resume_pdf_url: '/assets/Suryakiran-PJ-CV.pdf',
    availability: 'Available for Full-time Roles & High-Impact Projects',
    is_active: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    adminApiClient.getProfile()
      .then(data => {
        if (data) setProfile(data);
      })
      .catch(err => {
        showToast(err.message || 'Failed to load profile.', 'danger');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      showToast('Name and Email are required.', 'danger');
      return;
    }

    setSaving(true);
    try {
      const updated = await adminApiClient.updateProfile(profile);
      setProfile(updated);
      showToast('Profile updated successfully in PostgreSQL!');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info" role="status"></div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {toast && (
        <div className={`admin-toast ${toast.type === 'danger' ? 'bg-danger text-white' : 'bg-success text-white'}`}>
          {toast.type === 'danger' ? <AlertTriangle size={18} /> : <Check size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div>
          <h1 className="h3 text-white fw-bold mb-1">Developer Profile</h1>
          <p className="text-secondary small font-monospace mb-0">
            Edit your primary bio, role, contact info, availability, and CV resource links.
          </p>
        </div>
        <button
          type="submit"
          form="profile-form"
          disabled={saving}
          className="admin-btn admin-btn-primary"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <form id="profile-form" onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        {/* Core Info */}
        <div className="admin-card p-4">
          <h2 className="h6 text-white fw-bold mb-3 d-flex align-items-center gap-2 font-monospace">
            <User size={16} style={{ color: 'var(--admin-cyan)' }} />
            <span>PRIMARY IDENTITY</span>
          </h2>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="admin-label">Full Name *</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="admin-input"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="admin-label">Professional Role / Title *</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="admin-input"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="admin-label">Primary Email *</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="admin-input font-monospace"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="admin-label">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="col-12">
              <label className="admin-label">Availability Status</label>
              <input
                type="text"
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                placeholder="e.g. Available for Full-time Roles & High-Impact Projects"
                className="admin-input"
              />
            </div>

            <div className="col-12">
              <label className="admin-label">Tagline (Hero Subheading)</label>
              <textarea
                rows="2"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="admin-textarea"
              />
            </div>

            <div className="col-12">
              <label className="admin-label">Professional Summary (About Section)</label>
              <textarea
                rows="4"
                value={profile.summary}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                className="admin-textarea"
              />
            </div>
          </div>
        </div>

        {/* Resources & Links */}
        <div className="admin-card p-4">
          <h2 className="h6 text-white fw-bold mb-3 d-flex align-items-center gap-2 font-monospace">
            <Globe size={16} style={{ color: 'var(--admin-cyan)' }} />
            <span>RESOURCES & SOCIAL PROFILES</span>
          </h2>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="admin-label">CV / Resume PDF URL</label>
              <input
                type="text"
                value={profile.resume_pdf_url}
                onChange={(e) => setProfile({ ...profile, resume_pdf_url: e.target.value })}
                className="admin-input font-monospace"
              />
            </div>

            <div className="col-md-6">
              <label className="admin-label">GitHub URL</label>
              <input
                type="url"
                value={profile.github_url}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                className="admin-input font-monospace"
              />
            </div>

            <div className="col-md-6">
              <label className="admin-label">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="admin-input font-monospace"
              />
            </div>

            <div className="col-md-6">
              <label className="admin-label">Instagram URL</label>
              <input
                type="url"
                value={profile.instagram_url}
                onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                className="admin-input font-monospace"
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mb-5">
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
