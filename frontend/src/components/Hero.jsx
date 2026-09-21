import React, { lazy, Suspense } from 'react';
import AntigravityQuantumSphere from './AntigravityQuantumSphere';

const ThreeHeroCanvas = lazy(() => import('./ThreeHeroCanvas'));

export default function Hero({ onOpenCV, onOpenCommandPalette, isReducedMotion }) {
  return (
    <section
      id="hero"
      className="position-relative w-100 min-vh-100 d-flex flex-column justify-content-center overflow-hidden"
      style={{ paddingTop: '100px', paddingBottom: '60px', background: '#08080c' }}
    >
      {/* Ambient Zero-G Photonic Glows (Layer 0) */}
      <div className="quantum-field-ambient-cyan" style={{ top: '-10%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="quantum-field-ambient-violet" style={{ top: '40%', left: '-15%' }} />

      {/* Ambient WebGL Particle System Background */}
      <Suspense fallback={null}>
        <ThreeHeroCanvas isReducedMotion={isReducedMotion} />
      </Suspense>

      <div className="container-fluid position-relative z-1" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Top Metadata Bar */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pt-3">
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
            style={{
              background: 'rgba(27, 27, 32, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
            }}
          >
            <span
              className="rounded-circle animate-ag-pulse"
              style={{ width: '8px', height: '8px', backgroundColor: '#00f0ff', display: 'inline-block' }}
            ></span>
            <span className="font-label-caps" style={{ color: '#7df4ff', letterSpacing: '0.12em' }}>
              PROTOTYPE 2027 // ZERO-G COMPUTING ARCHITECT
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 font-label-hud text-secondary" style={{ fontSize: '11px' }}>
            <span className="d-flex align-items-center gap-1">
              <span className="material-symbols-outlined" style={{ color: '#00f0ff', fontSize: '14px' }}>satellite_alt</span>
              ORBIT: LEO-G4 // NODE 19
            </span>
            <span className="d-none d-sm-inline-block text-muted">HASH: 0x9F41C..88EA</span>
            <span style={{ color: '#6ffbbe', fontWeight: 600 }}>TENSOR: ONLINE (4096 TFLOP)</span>
          </div>
        </div>

        {/* Hero Title & Positioning Grid */}
        <div className="row align-items-center g-4 g-lg-5">
          
          {/* Left Column: Mission Brief & Architectural CTAs */}
          <div className="col-lg-7 d-flex flex-column gap-3 z-1">
            <div className="d-flex align-items-center gap-2" style={{ color: '#d0bcff' }}>
              <span className="font-label-hud" style={{ letterSpacing: '0.16em' }}>
                [ PYTHON FULL-STACK // NEURAL TENSORS ]
              </span>
              <span style={{ width: '40px', height: '1px', backgroundColor: 'rgba(139, 92, 246, 0.5)' }}></span>
            </div>

            <h1 className="font-display-hero text-uppercase text-light m-0">
              SURYA KIRAN{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #00f0ff 0%, #7df4ff 50%, #d0bcff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                P J
              </span>
            </h1>

            <p className="font-body-lg text-secondary m-0" style={{ maxWidth: '640px', color: '#b9cacb' }}>
              Architecting high-dimensional Python backends, zero-overhead asynchronous mesh runtimes, and holographic WebGPU spatial interfaces calibrated for zero-gravity telemetry.
            </p>

            {/* Command Reticle CTA Matrix */}
            <div className="d-flex flex-wrap align-items-center gap-3 pt-2">
              <a href="#projects" className="btn-quantum-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>hub</span>
                Explore Neural Architecture
              </a>

              <a href="#dossier" className="btn-cyber-ghost">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                Antigravity Spec Dossier [PDF]
              </a>

              <a href="#terminal-section" className="btn-cyber-ghost">
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>terminal</span>
                [ RUN_EXEC ]
              </a>
            </div>

            {/* Telemetry Chips */}
            <div className="row g-2 pt-3" style={{ maxWidth: '560px' }}>
              <div className="col-4">
                <div
                  className="p-2 rounded d-flex flex-column"
                  style={{ background: 'rgba(14, 14, 18, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="font-label-hud text-muted">ASYNC RUNTIME</span>
                  <span className="font-headline-sm" style={{ color: '#7df4ff', marginTop: '2px' }}>3.14t</span>
                  <span className="font-label-hud" style={{ color: '#65f2b5', fontSize: '9px' }}>GIL-FREE / NATIVE</span>
                </div>
              </div>

              <div className="col-4">
                <div
                  className="p-2 rounded d-flex flex-column"
                  style={{ background: 'rgba(14, 14, 18, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="font-label-hud text-muted">PIPELINE LATENCY</span>
                  <span className="font-headline-sm" style={{ color: '#6ffbbe', marginTop: '2px' }}>1.8ms</span>
                  <span className="font-label-hud text-muted" style={{ fontSize: '9px' }}>p99 THROUGHPUT</span>
                </div>
              </div>

              <div className="col-4">
                <div
                  className="p-2 rounded d-flex flex-column"
                  style={{ background: 'rgba(14, 14, 18, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="font-label-hud text-muted">GRAVITY SCALAR</span>
                  <span className="font-headline-sm" style={{ color: '#e9ddff', marginTop: '2px' }}>0.00g</span>
                  <span className="font-label-hud" style={{ color: '#d0bcff', fontSize: '9px' }}>ACTIVE ANTIGRAV</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Holographic Spherical HUD Viewport */}
          <div className="col-lg-5 position-relative">
            <AntigravityQuantumSphere isReducedMotion={isReducedMotion} />
          </div>

        </div>
      </div>
    </section>
  );
}
