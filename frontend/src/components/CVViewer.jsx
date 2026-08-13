import React, { useEffect } from 'react';
import { X, Download, Printer, Mail, Github, Linkedin, GraduationCap, Code, Database, Globe } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function CVViewer({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Triggers download of the public PDF asset
    const link = document.createElement('a');
    link.href = '/assets/Suryakiran-PJ-CV.pdf';
    link.download = 'Suryakiran-PJ-CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1070 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content modal-glass border-0 shadow-lg overflow-hidden">
          {/* Header Controls */}
          <div className="modal-header border-bottom border-secondary border-opacity-25 px-4 py-3 align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="badge badge-brand me-2">Curriculum Vitae</span>
              <h3 className="modal-title h5 text-primary fw-bold mb-0">{personalInfo.name} — ATS Resume</h3>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={handlePrint}
                className="btn btn-outline-brand btn-sm d-none d-sm-inline-flex align-items-center gap-1"
                title="Print CV"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="btn btn-brand btn-sm d-flex align-items-center gap-1"
              >
                <Download size={16} />
                <span>Download CV (PDF)</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-brand rounded-circle p-1 d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px' }}
                onClick={onClose}
                aria-label="Close CV viewer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Printable ATS Document Body */}
          <div className="modal-body p-4 p-md-5 overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <div className="glass-panel p-4 p-md-5 bg-white text-dark rounded-3 shadow-sm printable-cv-document">
              {/* Header */}
              <div className="border-bottom pb-4 mb-4 text-center text-md-start d-md-flex justify-content-between align-items-end">
                <div>
                  <h1 className="h2 text-dark fw-bold mb-1">{personalInfo.name}</h1>
                  <h2 className="h5 text-primary fw-semibold mb-2">{personalInfo.role}</h2>
                  <p className="small text-muted mb-0 max-w-xl">{personalInfo.tagline}</p>
                </div>
                <div className="mt-3 mt-md-0 small text-md-end text-muted d-flex flex-column gap-1">
                  <div><strong>Email:</strong> {personalInfo.email}</div>
                  <div><strong>GitHub:</strong> github.com/skiran-ai</div>
                  <div><strong>LinkedIn:</strong> linkedin.com/in/surya-kiran-967659351</div>
                  <div><strong>Location:</strong> Kerala, India</div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-4">
                <h3 className="h6 text-dark text-uppercase fw-bold border-bottom pb-1 mb-2">Professional Summary</h3>
                <p className="small text-secondary mb-0 line-height-relaxed">{personalInfo.summary}</p>
              </div>

              {/* Education */}
              <div className="mb-4">
                <h3 className="h6 text-dark text-uppercase fw-bold border-bottom pb-1 mb-2">Education</h3>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong className="text-dark">{personalInfo.education.degree}</strong>
                    <div className="small text-muted">{personalInfo.education.institution}</div>
                  </div>
                </div>
              </div>

              {/* Technical Skills Matrix */}
              <div className="mb-4">
                <h3 className="h6 text-dark text-uppercase fw-bold border-bottom pb-1 mb-2">Technical Skills</h3>
                <div className="row g-3 small">
                  <div className="col-md-6">
                    <strong className="text-dark d-block mb-1">Frontend Development:</strong>
                    <span className="text-secondary">HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), React.js, Responsive Web Design</span>
                  </div>
                  <div className="col-md-6">
                    <strong className="text-dark d-block mb-1">Backend Development:</strong>
                    <span className="text-secondary">Python, Django, Django REST Framework, RESTful API Architecture, Relational Databases</span>
                  </div>
                  <div className="col-md-6">
                    <strong className="text-dark d-block mb-1">Developer Tools & Version Control:</strong>
                    <span className="text-secondary">Git, GitHub, VS Code, Postman API Testing</span>
                  </div>
                  <div className="col-md-6">
                    <strong className="text-dark d-block mb-1">Core Competencies:</strong>
                    <span className="text-secondary">Full Stack Architecture, Component Design, State Management, Problem Solving</span>
                  </div>
                </div>
              </div>

              {/* Projects Showcase */}
              <div className="mb-4">
                <h3 className="h6 text-dark text-uppercase fw-bold border-bottom pb-1 mb-2">Key Projects & Applications</h3>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong className="text-dark">DevNexus — Full Stack Developer Hub</strong>
                    <span className="small text-muted font-code">React | Django | REST API</span>
                  </div>
                  <p className="small text-secondary mb-1">
                    Engineered full stack collaboration platform featuring Django backend authentication, JWT tokens, REST API endpoints, and a React frontend dashboard.
                  </p>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong className="text-dark">SwiftCart — Modern E-Commerce Platform</strong>
                    <span className="small text-muted font-code">Python | Django | React.js</span>
                  </div>
                  <p className="small text-secondary mb-1">
                    Developed e-commerce engine leveraging Django ORM for product management and order processing with dynamic React shopping cart UI.
                  </p>
                </div>

                <div>
                  <div className="d-flex justify-content-between">
                    <strong className="text-dark">PyEngine — Django RESTful API Service</strong>
                    <span className="small text-muted font-code">Python | Django REST Framework</span>
                  </div>
                  <p className="small text-secondary mb-1">
                    Architected modular backend API endpoints using custom serializers, input validation guards, error handling, and Postman API test collections.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top border-secondary border-opacity-25 px-4 py-3 justify-content-between">
            <button onClick={handleDownloadPDF} className="btn btn-brand">
              <Download size={18} />
              <span>Download PDF File</span>
            </button>
            <button onClick={onClose} className="btn btn-outline-brand">
              Close / Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
