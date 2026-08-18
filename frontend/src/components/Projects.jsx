import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Code, Github, ExternalLink, Info, Filter, Cpu } from 'lucide-react';
import { apiClient } from '../services/apiClient';

const ProjectModal = lazy(() => import('./ProjectModal'));
const ProjectXRayModal = lazy(() => import('./ProjectXRayModal'));

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [xrayProject, setXrayProject] = useState(null);

  const categories = ['All', 'Full Stack', 'Backend', 'Frontend', 'AI/ML'];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient.getProjects(activeTab).then((data) => {
      if (isMounted) {
        setProjects(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [activeTab]);

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
            Explore Suryakiran's full-stack web platforms, REST API services, and frontend applications. Powered dynamically by Django REST API.
          </p>

          {/* Category Filter Tabs */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`btn ${
                  activeTab === cat ? 'btn-brand' : 'btn-outline-brand'
                } px-3 py-1.5 rounded-pill font-semibold small transition-all`}
              >
                {cat === 'All' && <Filter size={14} className="me-1" />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="row gy-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="col-md-6 col-lg-4">
                <div className="glass-card p-4 h-100 placeholder-glow">
                  <div className="placeholder bg-secondary bg-opacity-25 rounded w-100 mb-3" style={{ height: '180px' }}></div>
                  <div className="placeholder bg-secondary bg-opacity-25 rounded w-75 mb-2" style={{ height: '24px' }}></div>
                  <div className="placeholder bg-secondary bg-opacity-25 rounded w-100 mb-3" style={{ height: '16px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-5 glass-card p-4">
            <p className="text-secondary mb-0">No projects found in the "{activeTab}" category.</p>
          </div>
        ) : (
          <div className="row gy-4">
            {projects.map((project) => (
              <div key={project.id || project.slug} className="col-md-6 col-lg-4">
                <div className="glass-card h-100 d-flex flex-column overflow-hidden transition-all hover-glow">
                  {/* Thumbnail Header */}
                  <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                    <img
                      src={project.image_url || project.image}
                      alt={project.title}
                      className="w-100 h-100 object-fit-cover transition-transform"
                      style={{ transition: 'transform 0.4s ease' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <span
                      className="position-absolute top-0 end-0 m-3 badge badge-brand shadow-sm font-code"
                      style={{ backdropFilter: 'blur(8px)' }}
                    >
                      {project.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                    <div>
                      <h3 className="h5 text-primary fw-bold mb-2">{project.title}</h3>
                      <p className="small text-secondary mb-3">
                        {project.short_description || project.shortDesc}
                      </p>

                      {/* Tech Badges */}
                      <div className="d-flex flex-wrap gap-1.5 mb-4">
                        {project.technologies?.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="badge bg-secondary bg-opacity-25 text-cyan-400 font-code small"
                            style={{ fontSize: '0.75rem' }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies?.length > 4 && (
                          <span className="badge bg-secondary bg-opacity-25 text-secondary font-code small" style={{ fontSize: '0.75rem' }}>
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="d-flex flex-column gap-2 pt-3 border-top border-secondary border-opacity-25">
                      <div className="d-flex align-items-center justify-content-between">
                        <button
                          onClick={() => setSelectedProject({
                            ...project,
                            image: project.image_url || project.image,
                            shortDesc: project.short_description,
                            githubUrl: project.github_url,
                            liveUrl: project.live_url,
                            details: {
                              problem: project.problem_statement,
                              solution: project.solution_architecture,
                              features: project.features || [],
                              role: project.my_role
                            }
                          })}
                          className="btn btn-outline-brand btn-sm d-flex align-items-center gap-1"
                        >
                          <Info size={15} />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => setXrayProject(project)}
                          className="btn btn-brand btn-sm d-flex align-items-center gap-1 font-code"
                        >
                          <Cpu size={15} />
                          <span>X-RAY</span>
                        </button>
                      </div>

                      <div className="d-flex align-items-center justify-content-end gap-2">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-brand btn-sm p-1.5 rounded-circle"
                            title="GitHub Repo"
                          >
                            <Github size={15} />
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-brand btn-sm p-1.5 rounded-circle"
                            title="Live Demo"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Standard Details Modal */}
      {selectedProject && (
        <Suspense fallback={null}>
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </Suspense>
      )}

      {/* Technical X-Ray Visual Architecture Modal */}
      {xrayProject && (
        <Suspense fallback={null}>
          <ProjectXRayModal
            project={xrayProject}
            onClose={() => setXrayProject(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
