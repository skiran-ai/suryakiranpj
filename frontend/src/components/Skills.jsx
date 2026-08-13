import React from 'react';
import { skillsData } from '../data/portfolioData';
import { Cpu, Terminal, Database, Shield, Globe, Layers, Smartphone, Sparkles, Code } from 'lucide-react';

export default function Skills() {
  const iconMap = {
    Code: Code,
    Layers: Layers,
    Layout: Layers,
    Terminal: Terminal,
    Cpu: Cpu,
    Database: Database,
    Globe: Globe,
    Shield: Shield,
    Github: Shield,
    Smartphone: Smartphone,
    Sparkles: Sparkles
  };

  const categories = [
    { title: "Frontend Engineering", key: "frontend", icon: Cpu, accent: "var(--accent-cyan)" },
    { title: "Backend Architecture", key: "backend", icon: Database, accent: "var(--accent-purple)" },
    { title: "Tools & Workflow", key: "tools", icon: Shield, accent: "var(--accent-emerald)" },
    { title: "Development Concepts", key: "development", icon: Sparkles, accent: "var(--accent-blue)" }
  ];

  return (
    <section id="skills" className="section-padding position-relative">
      <div className="container">
        {/* Section Title */}
        <div className="text-center mb-5">
          <div className="badge-brand mb-2">
            <Cpu size={16} />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="display-5 section-title">
            Skills & <span className="text-gradient">Tech Stack</span>
          </h2>
          <p className="section-subtitle">
            A comprehensive overview of technologies, frameworks, and core competencies Suryakiran uses to engineer robust software solutions.
          </p>
        </div>

        {/* Skill Categories Grid */}
        <div className="row gy-4">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            const skillsList = skillsData[category.key] || [];

            return (
              <div key={category.key} className="col-md-6 col-lg-3">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    {/* Category Header */}
                    <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                      <div
                        className="rounded-circle p-2.5 d-flex align-items-center justify-content-center"
                        style={{
                          background: 'var(--gradient-glow)',
                          color: category.accent
                        }}
                      >
                        <CategoryIcon size={24} />
                      </div>
                      <h3 className="h6 mb-0 text-primary fw-bold">{category.title}</h3>
                    </div>

                    {/* Skill Badges List */}
                    <div className="d-flex flex-column gap-3">
                      {skillsList.map((skill, idx) => {
                        const IconComponent = iconMap[skill.icon] || Code;
                        return (
                          <div
                            key={idx}
                            className="glass-panel p-2.5 px-3 d-flex align-items-center justify-content-between transition-all"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <IconComponent size={18} style={{ color: category.accent }} />
                              <span className="fw-semibold text-primary small">{skill.name}</span>
                            </div>
                            <span className="badge bg-secondary bg-opacity-25 text-secondary small font-code" style={{ fontSize: '0.7rem' }}>
                              {skill.badge}
                            </span>
                          </div>
                        );
                      })}
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
