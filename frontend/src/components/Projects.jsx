import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Code, Github, ExternalLink, Info, Filter, Cpu, Layers } from 'lucide-react';
import { apiClient } from '../services/apiClient';

const ProjectModal = lazy(() => import('./ProjectModal'));
const ProjectXRayModal = lazy(() => import('./ProjectXRayModal'));

export default function Projects() {
  const [viewMode, setViewMode] = useState('flagship'); // 'flagship' | 'all'
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [xrayProject, setXrayProject] = useState(null);

  const categories = ['All', 'AI/ML', 'Full Stack', 'Backend', 'Frontend'];

  // Static 2027 Flagship Autonomous Systems from Stitch Specification
  const flagshipSystems = [
    {
      id: "aether-py",
      title: "AETHER-PY: Distributed Asynchronous Physics & Vector Engine",
      projId: "PROJ_ID // 01",
      metricBadge: "2.4M OPS/SEC",
      category: "AI/ML & Distributed Systems",
      shortDesc: "Massively parallel orbital gravity simulation engine. Employs Python 3.13+ GIL-free multithreading, WebGPU compute kernels, and clustered Redis vector state trees to calculate 20,000 interacting celestial bodies in real time.",
      technologies: ["Python 3.14t", "WebGPU Compute", "Redis Cluster", "SIMD Vectors"],
      githubUrl: "https://github.com/skiran-ai/aether-py-engine",
      liveUrl: "https://suryakiranpj.netlify.app/#projects",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      hudOverlay: {
        state: "STATE: STABLE",
        particles: "PARTICLES: 20,480",
        stat: "GPU_COMPUTE: 98.4%",
      },
      architecture: {
        pattern: "Distributed Zero-G Actor Engine",
        frontend: "WebGPU Volumetric Shaders & Three.js",
        backend: "Python 3.14t Free-Threaded CPython + Ray Cluster",
        database: "Redis 8 Vector Mesh + Apache Arrow",
        flow: [
          "1. 20,480 physical bodies dispatched to Ray multi-threaded worker nodes",
          "2. WebGPU compute shader calculates pairwise gravitational attraction tensors",
          "3. Vector mesh state cached in-memory with sub-millisecond serialization",
          "4. High-frequency WebSockets stream coordinates to client HUD at 120 FPS",
        ],
      },
    },
    {
      id: "chronos-hud",
      title: "CHRONOS HUD: 3D Autonomous AI Agent Command Center",
      projId: "PROJ_ID // 02",
      metricBadge: "AUTONOMOUS ORCHESTRATION",
      category: "Autonomous Multi-Agent Systems",
      shortDesc: "Mission-critical situational display powered by FastAPI and Next.js 15. Orchestrates asynchronous LangGraph agent swarms that detect, verify, and automatically heal distributed cloud anomalies across multi-region clusters.",
      technologies: ["FastAPI WebSocket", "LangGraph", "Next.js Spatial", "WebRTC Mesh"],
      githubUrl: "https://github.com/skiran-ai/chronos-ai-command-hud",
      liveUrl: "https://suryakiranpj.netlify.app/#projects",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      hudOverlay: {
        state: "AGENTS ACTIVE: 8",
        particles: "CONSENSUS: 99.8%",
        stat: "WS_PULSE: 0.4ms",
      },
      architecture: {
        pattern: "Hierarchical Multi-Agent StateGraph",
        frontend: "Next.js Spatial HUD + Three.js Glassmorphism",
        backend: "FastAPI AsyncIO 2.0 + LangGraph Swarms",
        database: "Milvus Vector DB + PostgreSQL pgvector",
        flow: [
          "1. Ingestion nodes stream telemetry across multi-cloud cluster logs",
          "2. LangGraph router evaluates cluster anomalies via quantized reasoning nodes",
          "3. Consensus engine validates auto-remediation scripts before deployment",
          "4. Bi-directional WebRTC socket broadcasts holographic HUD updates in 0.4ms",
        ],
      },
    },
    {
      id: "neuro-gravity",
      title: "NEURO-GRAVITY: Quantum-Resistant Neural API Gateway",
      projId: "PROJ_ID // 03",
      metricBadge: "POST-QUANTUM CRYPTO",
      category: "Cryptographic Neural Ingress",
      shortDesc: "High-security ingress proxy combining Rust C-FFI Python extensions with Cython acceleration. Transmits Kyber-1024 encrypted tensor packets at wire speed with sub-millisecond gRPC streaming validation.",
      technologies: ["Rust Extensions", "Cython 3.0", "Kyber-1024", "gRPC v2"],
      githubUrl: "https://github.com/skiran-ai/neuro-gravity-gateway",
      liveUrl: "https://suryakiranpj.netlify.app/#projects",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
      hudOverlay: {
        state: "CRYPTO: KYBER-1024",
        particles: "DROPPED: 0.00%",
        stat: "LATENCY: 0.28ms",
      },
      architecture: {
        pattern: "Zero-Copy C-FFI Tensor Ingress",
        frontend: "Cybernetic Monospace Telemetry HUD",
        backend: "Rust PyO3 Extension + Cython 3.0 Kernels",
        database: "Qdrant High-Density Vector Node",
        flow: [
          "1. Wire-speed gRPC packets ingested via Kyber-1024 post-quantum handshakes",
          "2. Rust FFI validates token payload authenticity without GIL locks",
          "3. Cython kernel vectors tensor matrices directly into neural inferencing pipelines",
          "4. Wire-level observability recorded with zero dropped packets (0.28ms latency)",
        ],
      },
    },
  ];

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
    <section id="projects" className="position-relative w-100 py-5" style={{ background: '#08080c' }}>
      <div className="container-fluid" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Section Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 font-label-hud mb-2" style={{ color: '#00dbe9' }}>
              <span>// SECTION 03</span>
              <span>•</span>
              <span style={{ letterSpacing: '0.14em' }}>RESEARCH &amp; DEPLOYMENT ARCHITECTURE</span>
            </div>
            <h2 className="font-headline-lg text-uppercase text-light m-0">
              Flagship <span style={{ color: '#00f0ff' }}>Autonomous Systems</span>
            </h2>
          </div>
          <div className="d-flex flex-column align-items-md-end gap-2">
            <span className="font-label-caps text-secondary" style={{ color: '#b9cacb' }}>
              STATUS: VERIFIED IN ZERO-G PRODUCTION
            </span>
            {/* View Mode Switcher */}
            <div className="d-flex gap-2">
              <button
                onClick={() => setViewMode('flagship')}
                className={`btn btn-sm font-label-caps px-3 py-1.5 rounded ${
                  viewMode === 'flagship' ? 'btn-quantum-primary' : 'btn-cyber-ghost'
                }`}
              >
                2027 Flagship Systems (3)
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`btn btn-sm font-label-caps px-3 py-1.5 rounded ${
                  viewMode === 'all' ? 'btn-quantum-primary' : 'btn-cyber-ghost'
                }`}
              >
                Production Deployments ({projects.length})
              </button>
            </div>
          </div>
        </div>

        {/* MODE A: 2027 Flagship Autonomous Systems (Stitch Spec) */}
        {viewMode === 'flagship' && (
          <div className="d-flex flex-column gap-4">
            {flagshipSystems.map((item, index) => (
              <div
                key={item.id}
                className="quantum-card p-4 rounded-3"
                style={{
                  background: 'rgba(31, 31, 36, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="row g-4 align-items-center">
                  
                  {/* Left Specs Info */}
                  <div className={`col-lg-5 ${index % 2 === 1 ? 'order-lg-2' : ''}`}>
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span
                          className="px-2 py-1 rounded font-label-hud"
                          style={{
                            background: index === 0 ? 'rgba(0, 240, 255, 0.12)' : index === 1 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                            color: index === 0 ? '#00f0ff' : index === 1 ? '#d0bcff' : '#6ffbbe',
                            fontWeight: 600,
                          }}
                        >
                          {item.projId}
                        </span>
                        <span className="font-label-hud" style={{ color: '#65f2b5' }}>
                          {item.metricBadge}
                        </span>
                      </div>

                      <h3 className="font-headline-md text-light mb-3 text-uppercase">
                        {item.title}
                      </h3>

                      <p className="font-body-md text-secondary mb-4" style={{ color: '#b9cacb', lineHeight: 1.6 }}>
                        {item.shortDesc}
                      </p>

                      {/* Tech Chips */}
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {item.technologies.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-label-hud px-2 py-1 rounded"
                            style={{
                              background: '#2a292e',
                              color: tIdx === 3 ? '#d0bcff' : '#7df4ff',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Action Triggers */}
                      <div className="d-flex flex-wrap align-items-center gap-3">
                        <button
                          onClick={() => setXrayProject({
                            title: item.title,
                            category: item.category,
                            short_description: item.shortDesc,
                            technologies: item.technologies,
                            architecture_pattern: item.architecture.pattern,
                            frontend_stack: item.architecture.frontend,
                            backend_stack: item.architecture.backend,
                            database_stack: item.architecture.database,
                            execution_flow: item.architecture.flow,
                          })}
                          className="btn-quantum-primary"
                        >
                          <Cpu size={14} />
                          <span>Inspect Architecture</span>
                        </button>

                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-cyber-ghost"
                        >
                          <Github size={14} />
                          <span>GitHub Kernel</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Holographic Preview Image with Micro HUD */}
                  <div className={`col-lg-7 ${index % 2 === 1 ? 'order-lg-1' : ''}`}>
                    <div
                      className="position-relative rounded-3 overflow-hidden"
                      style={{
                        background: '#0e0e12',
                        aspectRatio: '16 / 9',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-100 h-100 object-fit-cover transition-transform"
                        style={{ filter: 'brightness(0.85) contrast(1.1)' }}
                      />
                      <div
                        className="position-absolute inset-0 w-100 h-100"
                        style={{
                          background: 'linear-gradient(180deg, transparent 50%, rgba(14, 14, 18, 0.95) 100%)',
                        }}
                      />

                      {/* Micro HUD Overlay Strip */}
                      <div
                        className="position-absolute bottom-0 start-0 w-100 p-3 d-flex align-items-center justify-content-between pointer-events-none"
                        style={{ background: 'rgba(14, 14, 18, 0.85)', backdropFilter: 'blur(12px)' }}
                      >
                        <div className="d-flex align-items-center gap-3 font-label-hud">
                          <span style={{ color: '#6ffbbe', fontWeight: 700 }}>{item.hudOverlay.state}</span>
                          <span className="text-secondary">{item.hudOverlay.particles}</span>
                        </div>
                        <span className="font-code-terminal font-label-hud" style={{ color: '#00f0ff' }}>
                          {item.hudOverlay.stat}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE B: Production Deployments (Dynamic from Django REST API) */}
        {viewMode === 'all' && (
          <div>
            {/* Category Filter Tabs */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`btn btn-sm font-label-caps px-3 py-1.5 rounded ${
                    activeTab === cat ? 'btn-quantum-primary' : 'btn-cyber-ghost'
                  }`}
                >
                  {cat === 'All' && <Filter size={12} className="me-1" />}
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="row g-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="col-md-6 col-lg-4">
                    <div className="quantum-card p-4" style={{ height: '320px' }}>
                      <div className="placeholder bg-secondary bg-opacity-25 rounded w-100 mb-3" style={{ height: '160px' }}></div>
                      <div className="placeholder bg-secondary bg-opacity-25 rounded w-75 mb-2" style={{ height: '20px' }}></div>
                      <div className="placeholder bg-secondary bg-opacity-25 rounded w-100" style={{ height: '14px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-5 quantum-card p-4">
                <p className="text-secondary mb-0 font-code-terminal">No projects found in the "{activeTab}" category.</p>
              </div>
            ) : (
              <div className="row g-4">
                {projects.map((project) => (
                  <div key={project.id || project.slug} className="col-md-6 col-lg-4">
                    <div className="quantum-card h-100 d-flex flex-column overflow-hidden">
                      <div className="position-relative" style={{ height: '180px' }}>
                        <img
                          src={project.image_url || project.image}
                          alt={project.title}
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <span
                          className="position-absolute top-0 end-0 m-2 font-label-hud px-2 py-1 rounded"
                          style={{ background: 'rgba(14, 14, 18, 0.85)', color: '#00f0ff', border: '1px solid rgba(0, 240, 255, 0.2)' }}
                        >
                          {project.category}
                        </span>
                      </div>

                      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
                        <div>
                          <h3 className="font-headline-sm text-light mb-2">{project.title}</h3>
                          <p className="font-body-sm text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
                            {project.short_description || project.shortDesc}
                          </p>
                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {project.technologies?.slice(0, 4).map((tech, idx) => (
                              <span
                                key={idx}
                                className="font-label-hud px-1.5 py-0.5 rounded"
                                style={{ background: '#2a292e', color: '#7df4ff' }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between pt-2 border-top border-[rgba(255,255,255,0.06)]">
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
                            className="btn btn-sm btn-cyber-ghost p-1.5 font-label-hud"
                          >
                            <Info size={13} className="me-1" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => setXrayProject(project)}
                            className="btn btn-sm btn-quantum-primary p-1.5 font-label-hud"
                          >
                            <Cpu size={13} className="me-1" />
                            <span>X-RAY</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
