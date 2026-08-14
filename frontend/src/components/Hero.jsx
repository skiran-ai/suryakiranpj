import React, { lazy, Suspense } from 'react';
import { ArrowRight, FileText, Command } from 'lucide-react';

const ThreeHeroCanvas = lazy(() => import('./ThreeHeroCanvas'));

export default function Hero({ onOpenCV, onOpenCommandPalette, isReducedMotion }) {
  return (
    <section id="hero" className="position-relative min-vh-100 d-flex align-items-center justify-content-center overflow-hidden pt-5">
      {/* 3D WebGL Canvas Background with graceful Suspense fallback */}
      <Suspense
        fallback={
          <div
            className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.15) 0%, rgba(10, 12, 22, 1) 70%)',
              zIndex: 0
            }}
          />
        }
      >
        <ThreeHeroCanvas isReducedMotion={isReducedMotion} />
      </Suspense>

      <div className="container position-relative z-1 text-center py-5">
        <div className="max-w-900 mx-auto">
          {/* Status Badge */}
          <div className="d-inline-flex align-items-center gap-2 badge-brand mb-4 py-2 px-4 rounded-pill shadow-lg animate-fade-in font-code">
            <span className="rounded-circle bg-emerald-400 d-inline-block pulse-animation" style={{ width: '8px', height: '8px' }}></span>
            <span className="text-uppercase tracking-wider">Available for Full-time Roles & Remote Projects</span>
          </div>

          {/* Main Title Identity Reveal */}
          <h1 className="display-2 font-bold mb-3 tracking-tight text-white hero-title">
            SURYAKIRAN P. J.
          </h1>

          <h2 className="display-6 font-semibold mb-4 text-gradient font-code">
            PYTHON FULL STACK DEVELOPER
          </h2>

          <p className="lead text-secondary mb-5 max-w-750 mx-auto" style={{ fontSize: '1.2rem', lineHeight: '1.7' }}>
            Building production-grade full-stack web platforms with <strong className="text-primary">Python, Django REST Framework</strong>, and high-performance <strong className="text-primary">React.js</strong> user interfaces.
          </p>

          {/* Action CTAs */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-5 font-code">
            <a href="#projects" className="btn btn-brand btn-lg px-4 py-3 rounded-pill d-flex align-items-center gap-2 shadow-lg">
              <span>Explore Projects</span>
              <ArrowRight size={18} />
            </a>

            <button onClick={onOpenCV} className="btn btn-outline-brand btn-lg px-4 py-3 rounded-pill d-flex align-items-center gap-2">
              <FileText size={18} />
              <span>View & Download CV</span>
            </button>

            <button onClick={onOpenCommandPalette} className="btn btn-outline-brand btn-lg px-3 py-3 rounded-circle" title="Open Command Palette (Ctrl+K)">
              <Command size={20} />
            </button>
          </div>

          {/* Key Metrics / Highlights Grid */}
          <div className="row gy-3 justify-content-center max-w-900 mx-auto font-code">
            {[
              { label: "Frontend Stack", val: "React.js & JS ES6+", desc: "Stateful Component Architecture" },
              { label: "Backend Core", val: "Python & Django", desc: "RESTful APIs & Database ORM" },
              { label: "API Engineering", val: "Django REST Framework", desc: "Throttling, Auth & JSON Specs" },
              { label: "Full Stack Vision", val: "End-to-End Systems", desc: "Decoupled Scalable Architecture" }
            ].map((stat, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="glass-card p-3 h-100 text-center hover-glow">
                  <div className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>{stat.label}</div>
                  <div className="fw-bold text-cyan-400 mb-1" style={{ fontSize: '0.95rem' }}>{stat.val}</div>
                  <div className="small text-secondary" style={{ fontSize: '0.7rem' }}>{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
