import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Command, FileText, Sun, Moon, Menu, X, Sparkles, Send } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, onOpenCV, onOpenCommandPalette, onOpenAIWithMode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 80) {
        setHidden(currentScrollY > lastScrollY.current);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="fixed-top w-100"
      style={{
        zIndex: 1040,
        background: 'rgba(19, 19, 23, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="container-fluid max-w-[1440px] px-3 px-lg-4" style={{ maxWidth: '1440px', margin: '0 auto', height: '76px' }}>
        <div className="d-flex align-items-center justify-content-between h-100">
          
          {/* Brand Identity & Orbital Telemetry */}
          <div className="d-flex align-items-center gap-3">
            <a href="#hero" className="d-flex flex-column text-decoration-none group">
              <span className="font-headline-sm text-uppercase tracking-wider" style={{ color: '#00f0ff', letterSpacing: '0.08em', fontSize: '1.15rem' }}>
                SURYA.KIRAN
              </span>
              <span className="font-label-caps tracking-widest" style={{ color: '#94a3b8', fontSize: '0.625rem' }}>
                ANTIGRAVITY // 2027
              </span>
            </a>

            {/* Live Orbital Telemetry Chips (Desktop) */}
            <div className="d-none d-xl-flex align-items-center gap-2 ps-3 border-start border-[rgba(255,255,255,0.08)]">
              <div className="d-flex align-items-center gap-1.5 px-2 py-1 rounded" style={{ background: '#1b1b20', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span className="rounded-circle animate-ag-pulse" style={{ width: '6px', height: '6px', backgroundColor: '#65f2b5' }}></span>
                <span className="font-label-hud text-secondary" style={{ fontSize: '9px' }}>
                  SYS: <span style={{ color: '#65f2b5' }}>ONLINE</span>
                </span>
              </div>
              <div className="d-none d-2xl-flex align-items-center gap-1.5 px-2 py-1 rounded" style={{ background: '#1b1b20', border: '1px solid rgba(0,240,255,0.15)' }}>
                <span className="font-label-hud text-secondary" style={{ fontSize: '9px' }}>
                  G-FIELD: <span style={{ color: '#7df4ff' }}>0.00g</span>
                </span>
              </div>
              <div className="d-none d-2xl-flex align-items-center gap-1.5 px-2 py-1 rounded" style={{ background: '#1b1b20', border: '1px solid rgba(0,240,255,0.15)' }}>
                <span className="font-label-hud text-secondary" style={{ fontSize: '9px' }}>
                  LATENCY: <span style={{ color: '#00dbe9' }}>4ms</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-1">
            <a
              href="#hero"
              className="font-label-caps px-3 py-1.5 text-decoration-none rounded transition-all"
              style={{ color: '#00f0ff', background: 'rgba(31, 31, 36, 0.8)' }}
            >
              Core Architecture
            </a>
            <a
              href="#capabilities"
              className="font-label-caps px-3 py-1.5 text-decoration-none rounded text-[#94a3b8] hover:text-light transition-all"
              style={{ color: '#b9cacb' }}
            >
              Capability Matrix
            </a>
            <a
              href="#projects"
              className="font-label-caps px-3 py-1.5 text-decoration-none rounded transition-all"
              style={{ color: '#b9cacb' }}
            >
              Flagship Systems
            </a>
            <a
              href="#terminal-section"
              className="font-label-caps px-3 py-1.5 text-decoration-none rounded transition-all"
              style={{ color: '#b9cacb' }}
            >
              CLI Simulator
            </a>
            <a
              href="#dossier"
              className="font-label-caps px-3 py-1.5 text-decoration-none rounded transition-all"
              style={{ color: '#b9cacb' }}
            >
              Spec Dossier
            </a>
          </nav>

          {/* Action Triggers */}
          <div className="d-flex align-items-center gap-2">
            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="d-none d-sm-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded font-label-hud border-0 text-secondary"
              style={{ background: '#1b1b20', color: '#b9cacb', border: '1px solid rgba(255,255,255,0.08)' }}
              title="Command Palette (Ctrl + K)"
            >
              <Command size={13} style={{ color: '#00f0ff' }} />
              <span>CMD+K</span>
            </button>

            {/* AI Assistant Modes Dropdown */}
            <div className="position-relative">
              <button
                onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
                className="d-none d-md-flex align-items-center gap-1 px-2.5 py-1.5 rounded font-label-hud border-0"
                style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#d0bcff', border: '1px solid rgba(139, 92, 246, 0.3)' }}
                title="Grounded AI Assistant Modes"
              >
                <Sparkles size={13} />
                <span>AI MODES</span>
              </button>
              {aiDropdownOpen && (
                <div
                  className="position-absolute end-0 mt-2 p-2 rounded shadow-lg"
                  style={{
                    background: '#131317',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    minWidth: '190px',
                    zIndex: 1050,
                  }}
                >
                  <button
                    className="w-100 text-start px-2 py-1.5 rounded btn border-0 font-label-caps text-light mb-1 d-flex align-items-center gap-2"
                    style={{ fontSize: '10px' }}
                    onClick={() => {
                      onOpenAIWithMode('RECRUITER');
                      setAiDropdownOpen(false);
                    }}
                  >
                    <span>📋</span> Recruiter Mode
                  </button>
                  <button
                    className="w-100 text-start px-2 py-1.5 rounded btn border-0 font-label-caps text-light mb-1 d-flex align-items-center gap-2"
                    style={{ fontSize: '10px' }}
                    onClick={() => {
                      onOpenAIWithMode('CLIENT');
                      setAiDropdownOpen(false);
                    }}
                  >
                    <span>💼</span> Client Mode
                  </button>
                  <button
                    className="w-100 text-start px-2 py-1.5 rounded btn border-0 font-label-caps text-light d-flex align-items-center gap-2"
                    style={{ fontSize: '10px' }}
                    onClick={() => {
                      onOpenAIWithMode('DEVELOPER');
                      setAiDropdownOpen(false);
                    }}
                  >
                    <span>⚙️</span> Developer Mode
                  </button>
                </div>
              )}
            </div>

            {/* ATS CV Trigger */}
            <button
              onClick={onOpenCV}
              className="d-none d-sm-inline-flex align-items-center gap-1 px-2.5 py-1.5 rounded font-label-caps"
              style={{
                background: 'rgba(0, 240, 255, 0.08)',
                color: '#00f0ff',
                border: '1px solid rgba(0, 240, 255, 0.25)',
              }}
              title="View ATS Verified Resume"
            >
              <FileText size={13} />
              <span>ATS CV</span>
            </button>

            {/* Initialize Transmission (Contact CTA) */}
            <a
              href="#contact"
              className="d-none d-sm-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded text-decoration-none font-label-caps text-uppercase"
              style={{
                background: '#00f0ff',
                color: '#00363a',
                fontWeight: 600,
                letterSpacing: '0.12em',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.35)',
              }}
            >
              <Send size={12} />
              <span>Transmission</span>
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn p-1.5 rounded-circle d-flex align-items-center justify-content-center border-0 text-secondary"
              style={{ background: '#1b1b20', width: '34px', height: '34px' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} style={{ color: '#f59e0b' }} /> : <Moon size={15} style={{ color: '#00f0ff' }} />}
            </button>

            {/* Mobile Nav Toggle */}
            <button
              className="d-lg-none btn p-2 border-0 text-light"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation"
            >
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {navOpen && (
          <div
            className="d-lg-none p-3 rounded-bottom border-top border-[rgba(255,255,255,0.06)]"
            style={{ background: '#131317', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}
          >
            <div className="d-flex flex-column gap-2 font-label-caps">
              <a href="#hero" onClick={() => setNavOpen(false)} className="text-light text-decoration-none py-2 border-bottom border-[rgba(255,255,255,0.06)]">
                Core Architecture
              </a>
              <a href="#capabilities" onClick={() => setNavOpen(false)} className="text-light text-decoration-none py-2 border-bottom border-[rgba(255,255,255,0.06)]">
                Capability Matrix
              </a>
              <a href="#projects" onClick={() => setNavOpen(false)} className="text-light text-decoration-none py-2 border-bottom border-[rgba(255,255,255,0.06)]">
                Flagship Systems
              </a>
              <a href="#terminal-section" onClick={() => setNavOpen(false)} className="text-light text-decoration-none py-2 border-bottom border-[rgba(255,255,255,0.06)]">
                CLI Simulator
              </a>
              <a href="#dossier" onClick={() => setNavOpen(false)} className="text-light text-decoration-none py-2 border-bottom border-[rgba(255,255,255,0.06)]">
                Spec Dossier
              </a>
              <a href="#contact" onClick={() => setNavOpen(false)} className="text-[#00f0ff] text-decoration-none py-2">
                Initialize Transmission
              </a>
              <div className="d-flex gap-2 pt-2">
                <button
                  onClick={() => { onOpenCommandPalette(); setNavOpen(false); }}
                  className="btn btn-sm text-light flex-grow-1 font-label-hud"
                  style={{ background: '#1f1f24', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  CMD+K
                </button>
                <button
                  onClick={() => { onOpenCV(); setNavOpen(false); }}
                  className="btn btn-sm text-[#00f0ff] flex-grow-1 font-label-hud"
                  style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)' }}
                >
                  ATS CV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
