import React from 'react';
import { ArrowDown, FileText, Send, Sparkles, Code, Terminal } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import SocialLinks from './SocialLinks';

export default function Hero({ onOpenCV }) {
  return (
    <section id="home" className="min-vh-100 d-flex align-items-center position-relative pt-5">
      {/* Dynamic Background Glow Orbs */}
      <div
        className="position-absolute rounded-circle filter-blur"
        style={{
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(6, 182, 212, 0.12)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        className="position-absolute rounded-circle filter-blur"
        style={{
          bottom: '20%',
          right: '10%',
          width: '350px',
          height: '350px',
          background: 'rgba(139, 92, 246, 0.12)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center gy-5">
          {/* Text Content Left Side */}
          <div className="col-lg-7 text-center text-lg-start">
            <div className="badge-brand mb-3">
              <Sparkles size={16} />
              <span>{personalInfo.role}</span>
            </div>

            <h1 className="display-3 fw-extrabold mb-3">
              Hi, I'm <span className="text-gradient">{personalInfo.name}</span>
            </h1>

            <h2 className="h3 text-secondary fw-semibold mb-4">
              Python Full Stack Developer
            </h2>

            <p className="lead text-secondary mb-4 max-w-2xl">
              {personalInfo.tagline}
            </p>

            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-3 mb-4">
              <a href="#projects" className="btn btn-brand">
                <Code size={18} />
                <span>View Projects</span>
              </a>

              <button onClick={onOpenCV} className="btn btn-outline-brand">
                <FileText size={18} />
                <span>View CV</span>
              </button>

              <a href="#contact" className="btn btn-outline-brand">
                <Send size={18} />
                <span>Contact Me</span>
              </a>
            </div>

            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 pt-2">
              <span className="small text-muted fw-semibold">Connect with me:</span>
              <SocialLinks iconSize={18} />
            </div>
          </div>

          {/* Profile Image Frame Right Side */}
          <div className="col-lg-5 text-center">
            <div className="hero-image-wrapper">
              <div className="hero-image-inner">
                <img
                  src="/assets/profile.jpg"
                  alt={personalInfo.name}
                  onError={(e) => {
                    // Fallback to avatar if asset missing
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#about"
        className="position-absolute bottom-0 start-50 translate-middle-x mb-4 text-decoration-none text-muted d-none d-md-flex flex-column align-items-center gap-1 opacity-75 hover-opacity-100"
        aria-label="Scroll to About section"
      >
        <span className="small font-code">SCROLL DOWN</span>
        <ArrowDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}
