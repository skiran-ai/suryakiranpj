import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Command, FileText, Sun, Moon, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, onOpenCV, onOpenCommandPalette, onOpenAIWithMode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Only hide after scrolling past 80px (clears the hero top area)
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
    <nav
      className="navbar navbar-expand-lg fixed-top glass-nav py-3"
      style={{
        zIndex: 1030,
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="container">
        {/* Brand Identity */}
        <a
          className="navbar-brand d-flex align-items-center gap-2 font-code fw-bold text-primary"
          href="#"
          style={{ minWidth: 0, flexShrink: 1 }}
        >
          <div
            className="rounded-circle p-1.5 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ background: 'var(--gradient-brand)', color: '#fff' }}
          >
            <Terminal size={18} />
          </div>
          <span className="navbar-brand-text">SURYAKIRAN<span className="text-gradient">.DEV</span></span>
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-primary focus-none shadow-none flex-shrink-0"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
          style={{ minWidth: '44px', minHeight: '44px', padding: '10px' }}
        >
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${navOpen ? 'show glass-card p-3 mt-2' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 font-code align-items-center gap-lg-3 gap-2">
            <li className="nav-item">
              <a className="nav-link text-secondary hover-cyan" href="#hero" onClick={() => setNavOpen(false)}>Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-secondary hover-cyan" href="#about" onClick={() => setNavOpen(false)}>About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-secondary hover-cyan" href="#skills" onClick={() => setNavOpen(false)}>Skills</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-secondary hover-cyan" href="#projects" onClick={() => setNavOpen(false)}>Projects</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-secondary hover-cyan" href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
            </li>

            {/* Special AI Modes Menu Dropdown */}
            <li className="nav-item dropdown position-relative">
              <button
                className={`btn btn-outline-brand btn-sm dropdown-toggle rounded-pill px-3 py-1.5 d-flex align-items-center gap-1 font-code ${aiDropdownOpen ? 'show' : ''}`}
                type="button"
                onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
                aria-expanded={aiDropdownOpen}
              >
                <Sparkles size={14} />
                <span>AI Modes</span>
              </button>
              {aiDropdownOpen && (
                <ul className="dropdown-menu show glass-panel shadow-lg border-0 font-code p-2 position-absolute end-0 mt-2" style={{ minWidth: '180px', zIndex: 1050 }}>
                  <li>
                    <button
                      className="dropdown-item rounded small text-primary py-2 d-flex align-items-center gap-2"
                      onClick={() => {
                        onOpenAIWithMode('RECRUITER');
                        setAiDropdownOpen(false);
                        setNavOpen(false);
                      }}
                    >
                      <span>📋</span> Recruiter Mode
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item rounded small text-primary py-2 d-flex align-items-center gap-2"
                      onClick={() => {
                        onOpenAIWithMode('CLIENT');
                        setAiDropdownOpen(false);
                        setNavOpen(false);
                      }}
                    >
                      <span>💼</span> Client Mode
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item rounded small text-primary py-2 d-flex align-items-center gap-2"
                      onClick={() => {
                        onOpenAIWithMode('DEVELOPER');
                        setAiDropdownOpen(false);
                        setNavOpen(false);
                      }}
                    >
                      <span>⚙️</span> Developer Mode
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Command Palette Trigger */}
            <li className="nav-item">
              <button
                onClick={onOpenCommandPalette}
                className="btn btn-outline-brand btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
                title="Command Palette (Ctrl+K)"
              >
                <Command size={14} />
                <span className="small">Ctrl+K</span>
              </button>
            </li>

            {/* CV Modal Trigger */}
            <li className="nav-item">
              <button
                onClick={onOpenCV}
                className="btn btn-brand btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
              >
                <FileText size={14} />
                <span>CV</span>
              </button>
            </li>

            {/* Theme Toggle */}
            <li className="nav-item">
              <button
                onClick={toggleTheme}
                className="btn btn-outline-brand btn-sm p-1.5 rounded-circle d-flex align-items-center justify-content-center"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
