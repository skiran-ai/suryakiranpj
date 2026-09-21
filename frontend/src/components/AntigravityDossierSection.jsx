import React, { useState } from 'react';
import AntigravityDossierModal from './AntigravityDossierModal';

export default function AntigravityDossierSection() {
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const handleDownloadWhitepaper = () => {
    setIsDossierOpen(true);
  };

  return (
    <section id="dossier" className="position-relative w-100 py-5" style={{ background: '#08080c' }}>
      <div className="container-fluid" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          className="p-4 p-md-5 rounded-3"
          style={{
            background: 'linear-gradient(135deg, #1f1f24 0%, #17171c 50%, #0e0e12 100%)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div className="row g-4 align-items-center">
            
            {/* Left Specs Details */}
            <div className="col-lg-8 d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-2 font-label-hud" style={{ color: '#d0bcff' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#65f2b5' }}>
                  verified
                </span>
                <span style={{ letterSpacing: '0.12em' }}>
                  VERIFIED ARCHITECTURAL DOSSIER // TECHNICAL WHITE PAPER
                </span>
              </div>

              <h2 className="font-headline-lg text-uppercase text-light m-0">
                Antigravity Python Architecture <span style={{ color: '#00f0ff' }}>Dossier</span> [2027]
              </h2>

              <p className="font-body-lg text-secondary m-0" style={{ maxWidth: '720px', color: '#b9cacb' }}>
                Complete technical specification detailing the mathematical foundations of the GIL-free Python asynchronous vector engine, WebGPU spatial shader integration, and multi-agent failover topology in microgravity computing clusters.
              </p>

              {/* Cryptographic Metadata Grid */}
              <div className="row g-3 pt-2">
                <div className="col-12 col-sm-4">
                  <div
                    className="p-3 rounded d-flex flex-column"
                    style={{ background: 'rgba(14, 14, 18, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="font-label-hud text-secondary">DOCUMENT DIGEST</span>
                    <span className="font-code-terminal fw-bold mt-1" style={{ color: '#00f0ff', fontSize: '13px' }}>
                      SHA-256
                    </span>
                    <span className="font-label-hud text-truncate text-secondary" style={{ fontSize: '9px' }}>
                      e3b0c44298fc1c149afbf4c8...
                    </span>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div
                    className="p-3 rounded d-flex flex-column"
                    style={{ background: 'rgba(14, 14, 18, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="font-label-hud text-secondary">PAGES / FORM FACTOR</span>
                    <span className="font-code-terminal fw-bold mt-1" style={{ color: '#d0bcff', fontSize: '13px' }}>
                      38 PAGES
                    </span>
                    <span className="font-label-hud text-secondary" style={{ fontSize: '9px' }}>
                      VECTOR PDF (A4 ORBITAL)
                    </span>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div
                    className="p-3 rounded d-flex flex-column"
                    style={{ background: 'rgba(14, 14, 18, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="font-label-hud text-secondary">CLEARANCE LEVEL</span>
                    <span className="font-code-terminal fw-bold mt-1" style={{ color: '#65f2b5', fontSize: '13px' }}>
                      PUBLIC ACCESS
                    </span>
                    <span className="font-label-hud text-secondary" style={{ fontSize: '9px' }}>
                      UNRESTRICTED SPEC
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="d-flex flex-wrap align-items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadWhitepaper}
                  className="btn-quantum-primary"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>file_download</span>
                  Download Whitepaper [PDF • 14.8 MB]
                </button>

                <button
                  type="button"
                  onClick={() => setIsDossierOpen(true)}
                  className="btn-cyber-ghost"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                  Live Holographic Preview
                </button>
              </div>
            </div>

            {/* Right Holographic Preview Graphic Mockup */}
            <div className="col-lg-4 d-flex justify-content-center">
              <div
                className="w-100 rounded-3 overflow-hidden shadow-2xl"
                style={{
                  maxWidth: '360px',
                  background: '#08080c',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="px-3 py-2 d-flex align-items-center justify-content-between font-label-hud"
                  style={{ background: '#1b1b20', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-secondary">PDF_PREVIEW_VIEWER</span>
                  <span style={{ color: '#00f0ff' }}>PAGE 01 / 38</span>
                </div>

                <div className="p-4 d-flex flex-column gap-3" style={{ minHeight: '300px' }}>
                  <div className="d-flex align-items-center justify-content-between pb-2 border-bottom border-[rgba(255,255,255,0.06)]">
                    <span className="font-headline-sm text-light text-uppercase">SURYA KIRAN</span>
                    <span className="font-label-hud" style={{ color: '#d0bcff' }}>SPEC 2027-V4</span>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <div style={{ height: '6px', width: '75%', backgroundColor: '#2a292e', borderRadius: '4px' }}></div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: '#1f1f24', borderRadius: '4px' }}></div>
                    <div style={{ height: '6px', width: '85%', backgroundColor: '#2a292e', borderRadius: '4px' }}></div>
                    <div style={{ height: '6px', width: '50%', backgroundColor: '#353439', borderRadius: '4px' }}></div>
                  </div>

                  <div
                    className="my-2 p-2 rounded font-code-terminal"
                    style={{ background: '#131317', border: '1px solid rgba(16,185,129,0.2)', color: '#65f2b5', fontSize: '10px' }}
                  >
                    <div>∇ × B - ∂E/∂t = μ₀ (J + ε₀ ∂P/∂t)</div>
                    <div>lim_{'{g → 0}'} ∫ Ψ(x, t) dx = 1.0000</div>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <div style={{ height: '6px', width: '100%', backgroundColor: '#1f1f24', borderRadius: '4px' }}></div>
                    <div style={{ height: '6px', width: '80%', backgroundColor: '#2a292e', borderRadius: '4px' }}></div>
                  </div>

                  <div className="mt-auto d-flex align-items-center justify-content-between pt-3 font-label-hud text-secondary">
                    <span style={{ fontSize: '9px' }}>ORBITAL CIPHER VALIDATED</span>
                    <span className="material-symbols-outlined" style={{ color: '#00f0ff', fontSize: '18px' }}>qr_code_2</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Interactive Dossier Modal */}
      <AntigravityDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </section>
  );
}
