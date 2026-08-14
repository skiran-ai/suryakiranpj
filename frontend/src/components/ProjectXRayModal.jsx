import React from 'react';
import { X, Layers, Cpu, Database, Server, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ProjectXRayModal({ project, onClose }) {
  if (!project) return null;

  const steps = [
    {
      title: "Problem Statement",
      icon: Layers,
      color: "var(--accent-purple)",
      content: project.problem_statement || project.short_description
    },
    {
      title: "Solution Architecture",
      icon: Cpu,
      color: "var(--accent-cyan)",
      content: project.solution_architecture || project.detailed_description
    },
    {
      title: "Frontend Layer",
      icon: Globe,
      color: "#38bdf8",
      content: project.frontend_tech || "React 18, Vite, Bootstrap 5, Lucide Icons, Glassmorphism CSS"
    },
    {
      title: "API & REST Routing",
      icon: ArrowRight,
      color: "#818cf8",
      content: "JSON Endpoints, Serializers, Rate Throttling, CORS Security Headers"
    },
    {
      title: "Backend Core",
      icon: Server,
      color: "#10b981",
      content: project.backend_tech || "Python 3.11+, Django 4.2, Django REST Framework, Custom ViewSets"
    },
    {
      title: "Database Persistence",
      icon: Database,
      color: "#f59e0b",
      content: project.database_tech || "Relational Models (PostgreSQL / SQLite ORM), Indexing & Transactions"
    },
    {
      title: "Production Deployment",
      icon: ShieldCheck,
      color: "#ec4899",
      content: project.deployment_tech || "Netlify CDN + Django Cloud REST API, SSL Encryption & Security Headers"
    }
  ];

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3"
      onClick={onClose}
      style={{ zIndex: 1100 }}
    >
      <div
        className="glass-card p-4 p-md-5 max-w-900 w-100 overflow-y-auto max-h-90vh shadow-2xl border-gradient"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-25 pb-3 mb-4">
          <div>
            <span className="badge badge-brand mb-1">SYSTEM ARCHITECTURE X-RAY</span>
            <h3 className="h3 text-primary fw-bold mb-0">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-outline-brand p-2 rounded-circle"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* X-Ray Visual Pipeline Flow */}
        <div className="mb-4">
          <h4 className="h6 text-secondary font-code text-uppercase mb-4">
            Visual Execution Pipeline (Client to Database)
          </h4>

          <div className="d-flex flex-column gap-3">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div key={idx} className="glass-panel p-3 rounded-3 transition-all hover-glow">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-circle p-2.5 flex-shrink-0 d-flex align-items-center justify-content-center"
                      style={{ background: 'var(--gradient-glow)', color: step.color }}
                    >
                      <IconComp size={20} />
                    </div>

                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold text-primary font-code" style={{ color: step.color }}>
                          {idx + 1}. {step.title}
                        </span>
                        <span className="badge bg-secondary bg-opacity-25 font-code small" style={{ fontSize: '0.7rem' }}>
                          STAGE {idx + 1}
                        </span>
                      </div>
                      <p className="small text-secondary mb-0" style={{ lineHeight: '1.5' }}>
                        {step.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Badges Footer */}
        <div className="pt-3 border-top border-secondary border-opacity-25 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap gap-1.5">
            {project.technologies?.map((tech, idx) => (
              <span key={idx} className="badge bg-secondary bg-opacity-25 text-cyan-400 font-code small">
                {tech}
              </span>
            ))}
          </div>

          <div className="d-flex gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-brand btn-sm"
              >
                GitHub Repository
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-brand btn-sm"
              >
                View Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
