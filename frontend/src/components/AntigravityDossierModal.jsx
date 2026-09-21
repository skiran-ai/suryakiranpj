import React from 'react';
import { X, Download, ShieldCheck, Printer, Copy, Check } from 'lucide-react';

export default function AntigravityDossierModal({ isOpen, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `# TECHNICAL SPECIFICATION: ANTIGRAVITY COMPUTING & PYTHON FULL-STACK ARCHITECTURE
Document ID: AG-2027-SKPJ-001  
Author: Surya Kiran P J — Python Full Stack & Neural Systems Engineer  
Classification: Open Quantum / Public Architecture Protocol  
Date: March 2027  
Status: DEPLOYED // ZERO-G READY  

-------------------------------------------------------------------------
SYSTEM TELEMETRY: 2027 ORBITAL NODE
- Gravitational Potential: 0.00 G (Neutral Buoyancy)
- Engine Runtime: Python 3.14t (Free-Threaded CPython)
- Throughput: 2,480,000 req/sec
- P99 Latency: 0.84 ms
- Memory Footprint: 14.2 MB (Quantized Vector State)
-------------------------------------------------------------------------

1. EXECUTIVE SUMMARY & MISSION BRIEF
Modern web applications in 2027 transcend conventional 2D planar interfaces. The integration of high-concurrency Python distributed runtimes with real-time WebGPU spatial rendering forms the bedrock of the Antigravity Protocol.

2. SYSTEM ARCHITECTURE & FULL-STACK TOPOLOGY
2.1 Backend Quantum Micro-Services (Python Core)
- FastAPI / AsyncIO 2.0: Non-blocking async endpoints handling high-frequency telemetry.
- Python 3.14 No-GIL Concurrency: True multicore parallel execution.
- Micro-Engine Bridges: C++ and Rust extension modules bound via Cython and PyO3.
- Vector Memory Fabrics: Distributed caching via Redis 8 and in-memory vector indexers.

2.2 Frontend Spatial Experience & HUD
- Spatial UI Framework: Modern reactive component trees mapped to Three.js / WebGL volumetric shaders.
- Glassmorphic Antigravity Design: Dynamic chromatic refraction, adaptive luminescence, and cybernetic monospace telemetry overlays.
- Bi-directional WebSockets: Real-time state synchronisation between client DOM and asynchronous Python workers.

3. CORE PYTHON CAPABILITIES MATRIX
- High-Perf Backend: FastAPI, Django Nitro, AsyncIO, Celery 6 (2.4M req/sec)
- Agentic AI & LLMs: LangGraph, PyTorch 2.6, Llama-Index, ONNX (14ms TTFB)
- Data Pipelines: Apache Arrow, Polars, DuckDB, NumPy 2.x (100GB/min stream)
- Database & Vector: PostgreSQL 18 + pgvector, Milvus, Qdrant (Sub-ms query)
- Spatial & Client: WebGPU, Three.js, React 19, Tailwind v4 (120 FPS continuous)

4. BENCHMARKED PROJECTS & IMPLEMENTATIONS
- Project Alpha: AETHER-PY (Distributed Asynchronous Physics & Vector Engine)
- Project Beta: CHRONOS COMMAND HUD (3D Autonomous AI Agent Command Center)
- Project Gamma: NEURO-GRAVITY (Quantum-Resistant Neural API Gateway)

5. REPRODUCING THE ANTIGRAVITY ENVIRONMENT
git clone https://github.com/skiran-ai/antigravity-core.git
cd antigravity-core
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-2027.txt
python3 -c "import antigravity; antigravity.fly(altitude='stratosphere', target='2027')"

6. TRANSMISSION & CONTACT CHANNELS
Engineer: Surya Kiran P J
Ecosystem: Python Full Stack // Distributed Systems // AI Agents
Repository: github.com/skiran-ai
Orbital Vector: www.suryakiranpj.com / suryakiranpj.netlify.app
Authentication Signature: 0x7F9E4A1C98B22027-ANTIGRAVITY-VERIFIED
`;

    const blob = new Blob([textContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ANTIGRAVITY_ARCHITECTURE_SPEC_2027.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: 'rgba(5, 5, 8, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 1060,
      }}
      tabIndex="-1"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        style={{ maxWidth: '1000px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content text-light border-0 shadow-2xl overflow-hidden rounded-3"
          style={{
            background: '#0e0e12',
            border: '1px solid rgba(0, 240, 255, 0.25)',
          }}
        >
          {/* Top Holographic Navigation Bar */}
          <div
            className="modal-header d-flex align-items-center justify-content-between p-3 border-bottom border-[rgba(255,255,255,0.06)]"
            style={{ background: '#131317' }}
          >
            <div className="d-flex align-items-center gap-2 font-label-hud">
              <span className="material-symbols-outlined" style={{ color: '#00f0ff', fontSize: '18px' }}>
                verified
              </span>
              <span style={{ color: '#00f0ff', fontWeight: 600 }}>DOC_ID: AG-2027-SKPJ-001</span>
              <span className="text-secondary d-none d-sm-inline">| CLASSIFICATION: OPEN QUANTUM</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={handlePrint}
                className="btn btn-sm btn-cyber-ghost p-1.5 font-label-hud"
                title="Print / Save PDF"
              >
                <Printer size={13} />
                <span className="d-none d-sm-inline ms-1">PRINT / PDF</span>
              </button>

              <button
                onClick={handleDownload}
                className="btn btn-sm btn-quantum-primary p-1.5 font-label-hud"
                title="Download Specification Document"
              >
                <Download size={13} />
                <span className="d-none d-sm-inline ms-1">DOWNLOAD .MD</span>
              </button>

              <button
                onClick={onClose}
                className="btn btn-sm p-1.5 text-secondary hover-cyan border-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Dossier Content Body */}
          <div className="modal-body p-4 p-md-5 font-body-md" style={{ color: '#e4e1e8', lineHeight: 1.7 }}>
            
            {/* Header Document Metadata Block */}
            <div
              className="p-3 mb-4 rounded d-flex flex-column gap-2"
              style={{ background: 'rgba(19, 19, 23, 0.8)', border: '1px solid rgba(0, 240, 255, 0.15)' }}
            >
              <div className="d-flex flex-wrap align-items-center justify-content-between font-label-hud">
                <span style={{ color: '#6ffbbe' }}>STATUS: DEPLOYED // ZERO-G READY</span>
                <span className="text-secondary">DATE: MARCH 2027</span>
              </div>
              <h1 className="font-headline-md text-light text-uppercase m-0">
                Technical Specification: Antigravity Computing &amp; Python Full-Stack Architecture
              </h1>
              <div className="font-label-caps text-secondary" style={{ color: '#94a3b8' }}>
                AUTHOR: SURYA KIRAN P J — PYTHON FULL STACK &amp; NEURAL SYSTEMS ENGINEER
              </div>
            </div>

            {/* Telemetry ASCII Console Box */}
            <div
              className="p-3 rounded mb-4 font-code-terminal"
              style={{
                background: '#07070a',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                color: '#7df4ff',
                fontSize: '12px',
              }}
            >
              <pre className="m-0" style={{ fontFamily: 'inherit', color: 'inherit' }}>
{`+-----------------------------------------------------------------------+
|  SYSTEM TELEMETRY: 2027 ORBITAL NODE                                 |
|  - Gravitational Potential: 0.00 G (Neutral Buoyancy)                |
|  - Engine Runtime: Python 3.14t (Free-Threaded CPython)              |
|  - Throughput: 2,480,000 req/sec                                     |
|  - P99 Latency: 0.84 ms                                              |
|  - Memory Footprint: 14.2 MB (Quantized Vector State)                |
+-----------------------------------------------------------------------+`}
              </pre>
            </div>

            {/* Section 1 */}
            <div className="mb-4">
              <h3 className="font-headline-sm text-light mb-2 text-uppercase" style={{ color: '#00f0ff' }}>
                1. Executive Summary &amp; Mission Brief
              </h3>
              <p className="font-body-md text-secondary" style={{ color: '#b9cacb' }}>
                Modern web applications in 2027 transcend conventional 2D planar interfaces. The integration of high-concurrency Python distributed runtimes with real-time WebGPU spatial rendering forms the bedrock of the <strong>Antigravity Protocol</strong>. This document details the architectural paradigms, stack telemetry, and system benchmarks deployed by Surya Kiran P J.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-4">
              <h3 className="font-headline-sm text-light mb-2 text-uppercase" style={{ color: '#00f0ff' }}>
                2. System Architecture &amp; Full-Stack Topology
              </h3>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 rounded h-100" style={{ background: '#131317', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h5 className="font-label-caps text-[#7df4ff] mb-2">2.1 Backend Quantum Micro-Services</h5>
                    <ul className="list-unstyled d-flex flex-column gap-2 text-secondary mb-0" style={{ fontSize: '13px' }}>
                      <li>• <strong>FastAPI / AsyncIO 2.0:</strong> Non-blocking async endpoints handling telemetry data streams.</li>
                      <li>• <strong>Python 3.14 No-GIL:</strong> True multicore parallel execution across distributed GPU tensor nodes.</li>
                      <li>• <strong>Micro-Engine Bridges:</strong> C++ and Rust extension modules bound via Cython and PyO3.</li>
                      <li>• <strong>Vector Memory:</strong> Distributed caching via Redis 8 and in-memory vector indexers (HNSW / FAISS).</li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded h-100" style={{ background: '#131317', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h5 className="font-label-caps text-[#d0bcff] mb-2">2.2 Frontend Spatial Experience &amp; HUD</h5>
                    <ul className="list-unstyled d-flex flex-column gap-2 text-secondary mb-0" style={{ fontSize: '13px' }}>
                      <li>• <strong>Spatial UI Framework:</strong> Reactive component trees mapped to Three.js / WebGL volumetric shaders.</li>
                      <li>• <strong>Glassmorphic Antigravity Design:</strong> Dynamic chromatic refraction, luminescence, and HUD overlays.</li>
                      <li>• <strong>Bi-directional WebSockets:</strong> Real-time state synchronisation between client DOM and async Python workers.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Matrix Table */}
            <div className="mb-4">
              <h3 className="font-headline-sm text-light mb-3 text-uppercase" style={{ color: '#00f0ff' }}>
                3. Core Python Capabilities Matrix
              </h3>
              <div className="table-responsive">
                <table className="table table-dark table-bordered font-code-terminal" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <thead>
                    <tr style={{ background: '#1b1b20' }}>
                      <th style={{ color: '#00f0ff' }}>Domain</th>
                      <th style={{ color: '#7df4ff' }}>2027 Core Technologies</th>
                      <th style={{ color: '#65f2b5' }}>Production Benchmark</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold">High-Perf Backend</td>
                      <td>FastAPI, Django Nitro, AsyncIO, Celery 6</td>
                      <td style={{ color: '#65f2b5' }}>2.4M requests/sec</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Agentic AI &amp; LLMs</td>
                      <td>LangGraph, PyTorch 2.6, Llama-Index, ONNX</td>
                      <td style={{ color: '#65f2b5' }}>14ms token-to-first-byte</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Data Pipelines</td>
                      <td>Apache Arrow, Polars, DuckDB, NumPy 2.x</td>
                      <td style={{ color: '#65f2b5' }}>100GB/min stream ingest</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Database &amp; Vector</td>
                      <td>PostgreSQL 18 + pgvector, Milvus, Qdrant</td>
                      <td style={{ color: '#65f2b5' }}>Sub-millisecond ANN query</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Spatial &amp; Client</td>
                      <td>WebGPU, Three.js, React 19, Tailwind v4</td>
                      <td style={{ color: '#65f2b5' }}>120 FPS continuous render</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5: Reproduction CLI */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h3 className="font-headline-sm text-light m-0 text-uppercase" style={{ color: '#00f0ff' }}>
                  5. Reproducing the Antigravity Environment
                </h3>
                <button
                  onClick={() => handleCopyCode(`git clone https://github.com/skiran-ai/antigravity-core.git
cd antigravity-core
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-2027.txt
python3 -c "import antigravity; antigravity.fly(altitude='stratosphere', target='2027')"`)}
                  className="btn btn-sm btn-cyber-ghost p-1 font-label-hud"
                >
                  {copied ? <Check size={12} className="me-1" /> : <Copy size={12} className="me-1" />}
                  <span>{copied ? 'COPIED' : 'COPY VECTORS'}</span>
                </button>
              </div>

              <div
                className="p-3 rounded font-code-terminal"
                style={{ background: '#09090d', border: '1px solid rgba(255,255,255,0.08)', color: '#6ffbbe' }}
              >
                <div>$ git clone https://github.com/skiran-ai/antigravity-core.git</div>
                <div>$ cd antigravity-core</div>
                <div>$ python3 -m venv .venv &amp;&amp; source .venv/bin/activate</div>
                <div>$ pip install -r requirements-2027.txt</div>
                <div style={{ color: '#00f0ff' }}>$ python3 -c &quot;import antigravity; antigravity.fly(altitude='stratosphere', target='2027')&quot;</div>
              </div>
            </div>

            {/* Cryptographic Signature Footer */}
            <div
              className="p-3 rounded d-flex flex-wrap align-items-center justify-content-between gap-3 font-label-hud"
              style={{ background: '#131317', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={16} style={{ color: '#65f2b5' }} />
                <span>SIGNATURE: <span style={{ color: '#7df4ff' }}>0x7F9E4A1C98B22027-ANTIGRAVITY-VERIFIED</span></span>
              </div>
              <span className="text-secondary">DOMAIN: WWW.SURYAKIRANPJ.COM</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
