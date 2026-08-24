import React, { useState, useEffect } from 'react';
import { Cpu, Terminal, Database, Shield, Smartphone, Globe, Sparkles, Layers, Code, Layout, Bot, Zap } from 'lucide-react';
import { apiClient } from '../services/apiClient';

const iconMap = {
  Code, Layers, Layout, Terminal, Cpu, Database, Globe, Shield, Smartphone, Sparkles, Bot, Zap
};

export default function Skills() {
  const [skillsData, setSkillsData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    apiClient.getSkills().then(res => {
      setSkillsData(res);
    });
  }, []);

  if (!skillsData) {
    return (
      <section id="skills" className="section-padding position-relative">
        <div className="container text-center py-5">
          <div className="spinner-border text-cyan-400" role="status">
            <span className="visually-hidden">Loading skills matrix...</span>
          </div>
        </div>
      </section>
    );
  }

  const categories = [
    { key: 'all', label: 'All Stack' },
    { key: 'ai', label: 'AI & LLM' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'tools', label: 'Tools & DevOps' },
    { key: 'development', label: 'Core Capabilities' },
  ];

  const displayedSkills = activeCategory === 'all'
    ? skillsData.all
    : (skillsData.grouped[activeCategory] || []);

  return (
    <section id="skills" className="section-padding position-relative">
      <div className="container">
        {/* Section Heading */}
        <div className="text-center mb-5">
          <div className="badge-brand mb-2">
            <Cpu size={16} />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="display-5 section-title">
            Skills & <span className="text-gradient">Tech Stack</span>
          </h2>
          <p className="section-subtitle">
            Comprehensive breakdown of Suryakiran's technical proficiency across AI agents, LLM architectures, backend Python/Django systems, and frontend engineering.
          </p>

          {/* Filter Chips */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-4 font-code">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`btn ${
                  activeCategory === cat.key ? 'btn-brand' : 'btn-outline-brand'
                } px-3 py-1.5 rounded-pill font-semibold small transition-all`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="row gy-4">
          {displayedSkills.map((skill, idx) => {
            const IconComponent = iconMap[skill.icon_name] || Code;
            return (
              <div key={idx} className="col-sm-6 col-lg-3">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between transition-all hover-glow">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div
                        className="rounded-circle p-2.5 d-flex align-items-center justify-content-center"
                        style={{ background: 'var(--gradient-glow)', color: 'var(--accent-cyan)' }}
                      >
                        <IconComponent size={22} />
                      </div>
                      <span className="badge bg-secondary bg-opacity-25 text-secondary font-code small" style={{ fontSize: '0.7rem' }}>
                        {skill.category_display || skill.category}
                      </span>
                    </div>

                    <h3 className="h5 text-primary fw-bold mb-1">{skill.name}</h3>
                    <p className="small text-secondary mb-3">{skill.badge}</p>
                  </div>

                  {/* Proficiency Meter */}
                  <div>
                    <div className="d-flex justify-content-between text-muted font-code small mb-1" style={{ fontSize: '0.72rem' }}>
                      <span>Proficiency</span>
                      <span>{skill.proficiency || 90}%</span>
                    </div>
                    <div className="progress glass-panel" style={{ height: '6px' }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${skill.proficiency || 90}%`,
                          background: 'var(--gradient-brand)',
                          borderRadius: '10px'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
