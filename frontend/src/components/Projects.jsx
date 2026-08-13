import React, { useState } from 'react';
import { projectsData } from '../data/portfolioData';
import { Code, Github, ExternalLink, Info, Filter } from 'lucide-react';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack'];

  const filteredProjects = activeTab === 'All'
    ? projectsData
    : projectsData.filter(p => p.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <section id="projects" className="section-padding position-relative">
      <div className="container">
        {/* Section Heading */}
        <div className="text-center mb-5">
          <div className="badge-brand mb-2">
            <Code size={16} />
            <span>Featured Engineering</span>
          </div>
          <h2 className="display-5 section-title">
            Projects <span className="text-gradient">Showcase</span>
          </h2>
          <p className="section-subtitle">
            Explore Suryakiran's full stack applications, backend REST APIs, and frontend interfaces. Filter by technology category below.
          </p>

          {/* Filter Category Tabs */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`btn ${
                  activeTab === cat ? 'btn-brand' : 'btn-outline-brand'
                } px-4 py-2 rounded-pill font-semibold transition-all`}
              >
                {cat === 'All' && <Filter size={16} className="me-1" />}
                {cat} Projects
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="row gy-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="col-md-6 col-lg-4">
              <div className="glass-card h-100 d-flex flex-column overflow-hidden">
                {/* Thumbnail Header */}
                <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-100 h-100 object-fit-cover transition-transform"
                    style={{ transition: 'transform 0.4s ease' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <span
                    className="position-absolute top-0 end-0 m-3 badge badge-brand shadow-sm"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                  <div>
                    <h3 className="h5 text-primary fw-bold mb-2">{project.title}</h3>
                    <p className="small text-secondary mb-3">{project.shortDesc}</p>

                    {/* Tech Badges */}
                    <div className="d-flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="badge bg-secondary bg-opacity-25 text-secondary font-code small"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="badge bg-secondary bg-opacity-25 text-secondary font-code small" style={{ fontSize: '0.75rem' }}>
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="btn btn-outline-brand btn-sm d-flex align-items-center gap-1"
                    >
                      <Info size={16} />
                      <span>View Details</span>
                    </button>

                    <div className="d-flex gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-brand btn-sm p-2 rounded-circle"
                        aria-label="GitHub Repository"
                        title="GitHub Repo"
                      >
                        <Github size={16} />
                      </a>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-brand btn-sm p-2 rounded-circle"
                        aria-label="Live Demo"
                        title="Live Demo"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
