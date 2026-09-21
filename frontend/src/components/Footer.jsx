import React from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import { Lock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="position-relative w-100"
      style={{
        background: '#0e0e12',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
      }}
    >
      <div className="container-fluid" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* 4-Column Grid */}
        <div className="row g-4 mb-4">
          
          {/* Brand & Systems Status (2 Cols) */}
          <div className="col-12 col-md-6 d-flex flex-column gap-2">
            <span className="font-headline-sm text-uppercase tracking-wider" style={{ color: '#00f0ff', fontSize: '1.25rem' }}>
              SURYA.KIRAN
            </span>
            <p className="font-body-sm text-secondary m-0" style={{ maxWidth: '440px', color: '#b9cacb' }}>
              Next-generation Python Full Stack &amp; Neural Tensor Systems Engineer architecting quantum telemetry interfaces and zero-gravity computing paradigms.
            </p>
            
            <div className="d-flex align-items-center gap-3 pt-2">
              <div className="d-flex align-items-center gap-1.5">
                <span className="rounded-circle animate-ag-pulse" style={{ width: '6px', height: '6px', backgroundColor: '#65f2b5' }}></span>
                <span className="font-label-hud text-secondary" style={{ fontSize: '10px' }}>TENSOR-CORE: NOMINAL</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: '#7df4ff' }}></span>
                <span className="font-label-hud text-secondary" style={{ fontSize: '10px' }}>FLUID_DYNAMICS: ACTIVE</span>
              </div>
            </div>

            <div className="pt-2">
              <SocialLinks iconSize={16} />
            </div>
          </div>

          {/* Telemetry Matrix */}
          <div className="col-6 col-md-3 d-flex flex-column gap-2">
            <span className="font-label-caps text-uppercase" style={{ color: '#d0bcff' }}>
              Telemetry Matrix
            </span>
            <div className="d-flex flex-column gap-1 font-label-hud text-secondary" style={{ fontSize: '11px' }}>
              <span>NODE: DELTA-09</span>
              <span>UPTIME: 99.998%</span>
              <span>FREQ: 4.88 GHz CLUSTER</span>
              <span>SYS_STATUS: <span style={{ color: '#65f2b5' }}>OPTIMAL</span></span>
            </div>
          </div>

          {/* Command Link */}
          <div className="col-6 col-md-3 d-flex flex-column gap-2">
            <span className="font-label-caps text-uppercase" style={{ color: '#d0bcff' }}>
              Command Link
            </span>
            <div className="d-flex flex-column gap-1 font-label-hud text-secondary" style={{ fontSize: '11px' }}>
              <span>ORBIT_LOC: 28.6139 N, 77.2090 E</span>
              <span>PROTOCOL: TCP/QUIC HYBRID</span>
              <span>AUTH: 4096-BIT CURVE25519</span>
              <span>SHELL: ZSH_ORBITAL_v4</span>
              <div className="pt-1">
                <Link
                  to="/admin/login"
                  className="text-secondary text-decoration-none d-inline-flex align-items-center gap-1 hover-cyan"
                  style={{ fontSize: '10px', opacity: 0.6 }}
                  title="Admin Command Console"
                >
                  <Lock size={10} />
                  <span>SECURE_CONSOLE_LOGIN</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          className="pt-3 border-top border-[rgba(255,255,255,0.06)] d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 font-label-hud text-secondary"
          style={{ fontSize: '10px' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="text-uppercase tracking-wider" style={{ color: '#00f0ff' }}>
              2027 QUANTUM PROTOCOL // SURYA KIRAN
            </span>
            <span>•</span>
            <span>© {currentYear} ALL COGNITIVE ASSETS RESERVED</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span style={{ color: '#65f2b5' }}>LATENCY_SYNC: VERIFIED</span>
            <span style={{ color: '#7df4ff' }}>ZERO-G COMPUTING</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
