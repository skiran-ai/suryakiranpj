import React, { useEffect } from 'react';
import { X, Github, ExternalLink, CheckCircle, Code, Layers } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content modal-glass border-0 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom border-secondary border-opacity-25 px-4 py-3 align-items-center">
            <div className="d-flex align-items-center gap-2">
              <span className="badge badge-brand me-2">{project.category}</span>
              <h3 className="modal-title h5 text-primary fw-bold mb-0">{project.title}</h3>
            </div>
            <button
              type="button"
              className="btn btn-outline-brand rounded-circle p-1 d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 max-h-80vh overflow-y-auto">
            {/* Project Image Banner */}
            <div className="rounded-3 overflow-hidden mb-4 shadow-sm" style={{ maxHeight: '300px' }}>
              <img
                src={project.image}
                alt={project.title}
                className="w-100 h-100 object-fit-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>

            {/* Technologies */}
            <div className="mb-4">
              <h4 className="h6 text-primary fw-bold mb-2 d-flex align-items-center gap-2">
                <Code size={18} className="text-cyan-400" />
                <span>Technologies Used</span>
              </h4>
              <div className="d-flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="badge bg-secondary bg-opacity-25 text-primary px-3 py-2 rounded-pill font-code">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Problem & Solution */}
            <div className="row gy-3 mb-4">
              <div className="col-md-6">
                <div className="glass-panel p-3 h-100">
                  <h4 className="h6 text-cyan-400 fw-bold mb-2">The Challenge</h4>
                  <p className="small text-secondary mb-0">{project.details.problem}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="glass-panel p-3 h-100">
                  <h4 className="h6 text-purple-400 fw-bold mb-2" style={{ color: 'var(--accent-purple)' }}>The Solution</h4>
                  <p className="small text-secondary mb-0">{project.details.solution}</p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-4">
              <h4 className="h6 text-primary fw-bold mb-2 d-flex align-items-center gap-2">
                <Layers size={18} className="text-cyan-400" />
                <span>Key Technical Features</span>
              </h4>
              <div className="d-flex flex-column gap-2">
                {project.details.features.map((feature, idx) => (
                  <div key={idx} className="d-flex align-items-start gap-2 small text-secondary">
                    <CheckCircle size={16} className="text-emerald-400 mt-1 flex-shrink-0" style={{ color: 'var(--accent-emerald)' }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Developer Role */}
            <div className="glass-panel p-3 mb-4">
              <h4 className="h6 text-primary fw-bold mb-1">My Role in Project:</h4>
              <p className="small text-secondary mb-0">{project.details.role}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer border-top border-secondary border-opacity-25 px-4 py-3 justify-content-between">
            <div className="d-flex gap-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-brand"
              >
                <Github size={18} />
                <span>GitHub Repo</span>
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-brand"
                >
                  <ExternalLink size={18} />
                  <span>Live Demo</span>
                </a>
              )}
            </div>

            <button type="button" className="btn btn-outline-brand" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
