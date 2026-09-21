import React, { useState, useEffect } from 'react';

export default function AntigravityCapabilityMatrix() {
  const [throughput, setThroughput] = useState(2488912);

  // Subtle real-time fluctuation in telemetry throughput
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 2400) - 1200;
      setThroughput((prev) => prev + delta);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const pillars = [
    {
      id: "01 // CLUSTER",
      title: "Backend Core & Vector Mesh",
      icon: "terminal",
      iconColor: "#00f0ff",
      iconBg: "rgba(0, 240, 255, 0.1)",
      hoverBorder: "rgba(0, 240, 255, 0.4)",
      desc: "Ultra-low latency asynchronous infrastructure engineered for high-throughput streaming and high-dimensional semantic search.",
      metrics: [
        { name: "FastAPI / Async Python", val: "99.9%", color: "#65f2b5" },
        { name: "Milvus & Qdrant Vector DB", val: "8M VEC", color: "#7df4ff" },
        { name: "gRPC / Cap'n Proto Pipelines", val: "<0.8ms", color: "#d0bcff" },
        { name: "Django Microservices", val: "ENTERPRISE", color: "#94a3b8" },
      ],
    },
    {
      id: "02 // SPATIAL",
      title: "Frontend & 3D Spatial UI",
      icon: "view_in_ar",
      iconColor: "#8b5cf6",
      iconBg: "rgba(139, 92, 246, 0.15)",
      hoverBorder: "rgba(139, 92, 246, 0.4)",
      desc: "Reactive client architectures paired with custom WebGPU shaders and physics-based tactile glassmorphic telemetry consoles.",
      metrics: [
        { name: "React 19 / Next.js Spatial", val: "CONCURRENT", color: "#7df4ff" },
        { name: "Three.js / WebGPU Shaders", val: "120 FPS", color: "#65f2b5" },
        { name: "Tailwind CSS Architecture", val: "ZERO-RUNTIME", color: "#d0bcff" },
        { name: "Antigravity HUD Controls", val: "GLASS v4", color: "#94a3b8" },
      ],
    },
    {
      id: "03 // COGNITION",
      title: "Autonomous Agents & ML",
      icon: "psychology",
      iconColor: "#65f2b5",
      iconBg: "rgba(16, 185, 129, 0.12)",
      hoverBorder: "rgba(16, 185, 129, 0.4)",
      desc: "Decentralized multi-agent orchestrations and low-rank tensor pipelines delivering instantaneous real-world reasoning.",
      metrics: [
        { name: "PyTorch Tensor Modeling", val: "TORCH 2.6+", color: "#6ffbbe" },
        { name: "LangGraph Multi-Agent Nodes", val: "STATEGRAPH", color: "#00f0ff" },
        { name: "Quantized LLM Inferences", val: "4-BIT / EXL2", color: "#d0bcff" },
        { name: "ONNX Runtime Engine", val: "ZERO-LATENCY", color: "#94a3b8" },
      ],
    },
    {
      id: "04 // INFRA",
      title: "Zero-G Cloud & Infra",
      icon: "cloud_sync",
      iconColor: "#7df4ff",
      iconBg: "rgba(0, 219, 233, 0.12)",
      hoverBorder: "rgba(0, 219, 233, 0.4)",
      desc: "Distributed Kubernetes constellations and GPU-accelerated serverless clusters provisioned with immutable declarative code.",
      metrics: [
        { name: "Docker & K8s Helm Mesh", val: "AUTOMATED", color: "#65f2b5" },
        { name: "AWS Lambda GPU Clusters", val: "SCALE-TO-0", color: "#00f0ff" },
        { name: "Terraform State Sync", val: "IaC SECURE", color: "#d0bcff" },
        { name: "eBPF Network Observability", val: "REALTIME", color: "#94a3b8" },
      ],
    },
  ];

  return (
    <section
      id="capabilities"
      className="position-relative w-100 py-5"
      style={{ background: 'rgba(19, 19, 23, 0.65)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="container-fluid" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Section Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 font-label-hud mb-2" style={{ color: '#8b5cf6' }}>
              <span>// SECTION 02</span>
              <span>•</span>
              <span style={{ letterSpacing: '0.14em' }}>CAPABILITY DOMAINS</span>
            </div>
            <h2 className="font-headline-lg text-uppercase text-light m-0">
              Python Full Stack <span style={{ color: '#00f0ff' }}>Matrix</span> (2027)
            </h2>
          </div>
          <p className="font-body-sm text-secondary m-0" style={{ maxWidth: '480px', color: '#b9cacb' }}>
            High-throughput architectural pillars spanning asynchronous distributed microservices, WebGPU viewports, autonomous multi-agent clusters, and orbital cloud deployments.
          </p>
        </div>

        {/* Bento Cards Grid */}
        <div className="row g-4">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-3">
              <div
                className="quantum-card p-4 h-100 d-flex flex-column justify-content-between"
                style={{
                  background: 'rgba(31, 31, 36, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded"
                      style={{ width: '40px', height: '40px', background: pillar.iconBg, color: pillar.iconColor }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{pillar.icon}</span>
                    </div>
                    <span className="font-label-hud text-secondary">{pillar.id}</span>
                  </div>

                  <h3 className="font-headline-sm text-light mb-2" style={{ fontSize: '1.15rem' }}>
                    {pillar.title}
                  </h3>
                  <p className="font-body-sm text-secondary mb-4" style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {pillar.desc}
                  </p>
                </div>

                <div
                  className="d-flex flex-column gap-1 p-2 rounded"
                  style={{ background: 'rgba(14, 14, 18, 0.7)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  {pillar.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="d-flex align-items-center justify-content-between font-code-terminal py-1" style={{ fontSize: '12px' }}>
                      <span className="text-light" style={{ fontSize: '12px' }}>{m.name}</span>
                      <span className="font-label-hud" style={{ color: m.color, fontWeight: 600 }}>{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Performance Sparklines HUD Strip */}
        <div
          className="telemetry-strip mt-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{ background: 'rgba(14, 14, 18, 0.95)' }}
        >
          <div className="d-flex align-items-center gap-3">
            <span className="material-symbols-outlined" style={{ color: '#00f0ff', fontSize: '26px' }}>speed</span>
            <div className="d-flex flex-column">
              <span className="font-label-caps text-light" style={{ color: '#dbfcff', fontSize: '0.75rem' }}>
                Live Cluster Throughput Telemetry
              </span>
              <span className="font-label-hud text-secondary" style={{ fontSize: '10px' }}>
                AGGREGATE DATA INGESTION ACROSS 128 HYPER-NODES
              </span>
            </div>
          </div>

          {/* SVG Sparkline & Realtime Ticker */}
          <div className="d-flex align-items-center gap-4">
            <div style={{ width: '190px', height: '32px' }}>
              <svg className="w-100 h-100" fill="none" viewBox="0 0 100 24" style={{ color: '#00f0ff' }}>
                <path
                  d="M0,18 L12,14 L24,19 L36,8 L48,12 L60,4 L72,9 L84,2 L100,5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M0,18 L12,14 L24,19 L36,8 L48,12 L60,4 L72,9 L84,2 L100,5 L100,24 L0,24 Z"
                  fill="currentColor"
                  fillOpacity="0.15"
                />
              </svg>
            </div>

            <div className="d-flex flex-column align-items-end">
              <span className="font-headline-sm" style={{ color: '#6ffbbe', letterSpacing: '0.05em' }}>
                {throughput.toLocaleString()}
              </span>
              <span className="font-label-hud text-secondary" style={{ fontSize: '9px' }}>
                REQ / SEC RECORDED
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
