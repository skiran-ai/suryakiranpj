import React from 'react';
import { personalInfo } from '../data/portfolioData';
import { GraduationCap, Award, Cpu, Code2, Database, CheckCircle2 } from 'lucide-react';

export default function About() {
  const highlights = [
    "Full Stack Web Architecture & RESTful APIs",
    "Python & Django Backend Solutions",
    "React.js & Modern JavaScript Frontend",
    "Responsive Web Design & UI Integration",
    "Database Modeling & Scalable Logic",
    "Problem Solving & Continuous Tech Growth"
  ];

  return (
    <section id="about" className="section-padding position-relative">
      <div className="container">
        {/* Section Heading */}
        <div className="text-center mb-5">
          <div className="badge-brand mb-2">
            <Code2 size={16} />
            <span>Developer Overview</span>
          </div>
          <h2 className="display-5 section-title">
            About <span className="text-gradient">Suryakiran P. J.</span>
          </h2>
          <p className="section-subtitle">
            Passionate Python Full Stack Developer focused on creating impactful, scalable, and beautifully engineered web applications.
          </p>
        </div>

        <div className="row gy-4 align-items-stretch mb-4">
          {/* Photo Showcase Column */}
          <div className="col-lg-5">
            <div className="glass-card p-3 p-md-4 h-100 d-flex flex-column align-items-center justify-content-center text-center position-relative overflow-hidden hover-glow">
              <div className="position-relative mb-3 w-100" style={{ maxWidth: '340px' }}>
                <img
                  src="/assets/profile.jpg"
                  alt="Suryakiran P. J. - Python Full Stack Developer"
                  className="img-fluid rounded-4 shadow-2xl w-100"
                  style={{
                    height: '380px',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    border: '2px solid rgba(56, 189, 248, 0.4)'
                  }}
                />
                <div
                  className="position-absolute bottom-0 start-50 translate-middle-x mb-3 py-1.5 px-3 rounded-pill glass-panel border border-cyan-400 d-flex align-items-center gap-2 font-code small shadow-lg"
                  style={{ background: 'rgba(10, 12, 22, 0.85)', backdropFilter: 'blur(10px)', whiteSpace: 'nowrap' }}
                >
                  <span className="rounded-circle bg-emerald-400 d-inline-block pulse-animation" style={{ width: '8px', height: '8px' }}></span>
                  <span className="text-cyan-400 fw-bold">Suryakiran P. J.</span>
                </div>
              </div>
              <div className="text-center font-code">
                <p className="small text-gradient fw-bold mb-0">Python Full Stack Developer</p>
                <span className="small text-muted" style={{ fontSize: '0.8rem' }}>Kerala, India • Available for Full-Time Roles</span>
              </div>
            </div>
          </div>

          {/* Bio Text Column */}
          <div className="col-lg-7">
            <div className="glass-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <h3 className="h4 text-gradient mb-3">Building Across the Full Stack</h3>
                <p className="text-secondary mb-4" style={{ lineHeight: '1.7' }}>
                  {personalInfo.summary}
                </p>

                {/* Education Card */}
                <div className="glass-panel p-3 mb-4 d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ background: 'var(--gradient-glow)', color: 'var(--accent-cyan)' }}
                  >
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <h4 className="h6 mb-1 text-primary fw-bold">{personalInfo.education.degree}</h4>
                    <p className="small text-secondary mb-0">{personalInfo.education.institution}</p>
                  </div>
                </div>

                <h4 className="h6 text-primary fw-bold mb-3">Core Pillars & Capabilities:</h4>
                <div className="row g-2">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="col-sm-6">
                      <div className="d-flex align-items-center gap-2 text-secondary small">
                        <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0" style={{ color: 'var(--accent-cyan)' }} />
                        <span>{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Stats Grid */}
        <div className="row g-3">
          {personalInfo.stats.map((stat, index) => (
            <div key={index} className="col-6 col-lg-3">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center text-center hover-glow">
                <div
                  className="rounded-circle mx-auto mb-3 p-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '56px',
                    height: '56px',
                    background: 'var(--gradient-glow)',
                    color: index % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-purple)'
                  }}
                >
                  {index === 0 && <Code2 size={24} />}
                  {index === 1 && <Database size={24} />}
                  {index === 2 && <Cpu size={24} />}
                  {index === 3 && <Award size={24} />}
                </div>
                <h3 className="h5 fw-bold mb-1 text-gradient">{stat.value}</h3>
                <h4 className="h6 fw-semibold text-primary mb-2">{stat.label}</h4>
                <p className="small text-secondary mb-0">{stat.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
