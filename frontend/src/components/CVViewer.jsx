import React, { useState, useEffect } from 'react';
import { X, Download, FileText, CheckCircle2, GraduationCap, Briefcase, Code, Mail, MapPin, ExternalLink } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export default function CVViewer({ isOpen, onClose }) {
  const [cvData, setCvData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      apiClient.getCVMetadata().then(res => setCvData(res));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const data = cvData || {
    name: "Suryakiran P. J.",
    role: "Python Full Stack Developer",
    email: "suryakiranpjineesh@gmail.com",
    location: "Kerala, India",
    github: "https://github.com/skiran-ai",
    linkedin: "https://www.linkedin.com/in/surya-kiran-967659351",
    pdf_url: "/assets/Suryakiran-PJ-CV.pdf"
  };

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3"
      onClick={onClose}
      style={{ zIndex: 1150 }}
    >
      <div
        className="glass-card p-4 p-md-5 max-w-900 w-100 overflow-y-auto max-h-90vh shadow-2xl border-gradient"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-25 pb-3 mb-4">
          <div className="d-flex align-items-center gap-2">
            <FileText size={24} className="text-cyan-400" />
            <div>
              <h3 className="h4 text-primary fw-bold mb-0">ATS Curriculum Vitae</h3>
              <span className="small text-muted font-code">Verified Metadata Endpoint</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <a
              href={data.pdf_url}
              download="Suryakiran-PJ-CV.pdf"
              className="btn btn-brand btn-sm d-flex align-items-center gap-1.5 font-code"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </a>
            <button onClick={onClose} className="btn btn-outline-brand p-2 rounded-circle" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CV Document Content */}
        <div className="glass-panel p-4 rounded-3 text-primary font-sans">
          {/* Top Header Block */}
          <div className="text-center border-bottom border-secondary border-opacity-25 pb-4 mb-4">
            <img
              src="/assets/profile.jpg"
              alt={data.name}
              className="rounded-circle mb-3 shadow-lg"
              style={{
                width: '85px',
                height: '85px',
                objectFit: 'cover',
                objectPosition: 'top center',
                border: '2px solid rgba(56, 189, 248, 0.6)'
              }}
            />
            <h1 className="h2 fw-bold text-primary mb-1">{data.name}</h1>
            <p className="lead text-cyan-400 font-code fw-semibold mb-3">{data.role}</p>

            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 small text-secondary font-code">
              <span className="d-flex align-items-center gap-1"><Mail size={14} /> {data.email}</span>
              <span>•</span>
              <span className="d-flex align-items-center gap-1"><MapPin size={14} /> {data.location}</span>
              <span>•</span>
              <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-decoration-none d-flex align-items-center gap-1">
                GitHub <ExternalLink size={12} />
              </a>
              <span>•</span>
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-decoration-none d-flex align-items-center gap-1">
                LinkedIn <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-4">
            <h4 className="h6 text-cyan-400 font-code text-uppercase fw-bold mb-2">Professional Profile</h4>
            <p className="small text-secondary mb-0" style={{ lineHeight: '1.6' }}>
              Enthusiastic and results-driven Python Full Stack & AI Engineer with a solid foundation in computer science, full-stack web architecture, and modern Generative AI engineering. Specialized in building autonomous AI agents, verified RAG pipelines, fine-tuned LLM architectures, and scalable RESTful backend APIs in Django & FastAPI, paired with dynamic React.js interfaces.
            </p>
          </div>

          {/* Core Technical Stack */}
          <div className="mb-4">
            <h4 className="h6 text-cyan-400 font-code text-uppercase fw-bold mb-2">Core Skill Matrix</h4>
            <div className="row gy-2 small text-secondary">
              <div className="col-md-6">
                <strong>AI & LLM Engineering:</strong> LangGraph, LangChain, LlamaIndex, QLoRA, Unsloth, Vector DBs (Chroma/Qdrant), vLLM, OpenAI & Claude APIs
              </div>
              <div className="col-md-6">
                <strong>Backend Engineering:</strong> Python 3.11+, Django, Django REST Framework, FastAPI, REST & SSE Streaming, Celery & Redis
              </div>
              <div className="col-md-6">
                <strong>Frontend Development:</strong> React.js, JavaScript (ES6+), HTML5, CSS3, Bootstrap 5, Glassmorphism UI, Plotly/ECharts
              </div>
              <div className="col-md-6">
                <strong>Databases & DevOps:</strong> PostgreSQL, SQLite, DuckDB, Docker Sandboxing, Git/GitHub, Weights & Biases, Postman
              </div>
            </div>
          </div>

          {/* Key Engineering Projects */}
          <div className="mb-4">
            <h4 className="h6 text-cyan-400 font-code text-uppercase fw-bold mb-2">Featured Projects</h4>
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong className="text-primary">DataSense AI — Autonomous AI Data Analyst & BI Agent</strong>
                  <span className="badge bg-secondary bg-opacity-25 font-code small">LangGraph + Sandbox</span>
                </div>
                <p className="small text-secondary mb-0">Autonomous ReAct agent that ingests CSV/SQL datasets, writes/executes Python in an isolated Docker sandbox, and synthesizes dynamic charts with business anomaly insights.</p>
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong className="text-primary">OmniRAG — Agentic Document Intelligence & Verification Engine</strong>
                  <span className="badge bg-secondary bg-opacity-25 font-code small">LlamaIndex + Hybrid Search</span>
                </div>
                <p className="small text-secondary mb-0">Enterprise agentic RAG assistant featuring hybrid dense/BM25 retrieval, cross-encoder re-ranking, automated hallucination grading, and precise page citation previews.</p>
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong className="text-primary">SynapseSaaS — AI Code Reviewer & Architecture Studio</strong>
                  <span className="badge bg-secondary bg-opacity-25 font-code small">Django + React + SSE</span>
                </div>
                <p className="small text-secondary mb-0">Full-stack GenAI SaaS with GitHub PR webhooks, token-by-token streaming code reviews, automated Mermaid architecture diagrams, and Stripe billing tiers.</p>
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong className="text-primary">FinGuard-LLM — Domain-Specialized Financial & Compliance LLM</strong>
                  <span className="badge bg-secondary bg-opacity-25 font-code small">QLoRA + Unsloth + vLLM</span>
                </div>
                <p className="small text-secondary mb-0">Domain-adapted 7B parameter LLM fine-tuned on 50k+ SEC 10-K filings with 4-bit QLoRA, delivering 34% lower error rate and 4x inference speedup.</p>
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong className="text-primary">DevNexus — Full Stack Project Manager</strong>
                  <span className="badge bg-secondary bg-opacity-25 font-code small">Django + React</span>
                </div>
                <p className="small text-secondary mb-0">Full-stack project collaboration platform featuring DRF token authentication, custom serializers, and React Kanban state tracking board.</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h4 className="h6 text-cyan-400 font-code text-uppercase fw-bold mb-2">Education</h4>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong className="text-primary">Bachelor of Science (B.Sc.) in Computer Science</strong>
                <div className="small text-secondary">MG University, Kerala, India</div>
              </div>
              <span className="badge bg-secondary bg-opacity-25 font-code small">2020 – 2023</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
          <span className="small text-muted font-code">Formatted for ATS Resume Scanners</span>
          <a
            href={data.pdf_url}
            download="Suryakiran-PJ-CV.pdf"
            className="btn btn-brand btn-sm d-flex align-items-center gap-1 font-code"
          >
            <Download size={16} />
            <span>Download Official PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
}
