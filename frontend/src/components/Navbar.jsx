import React, { useState, useEffect } from 'react';
import { Menu, X, Code2, ArrowUpRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ theme, toggleTheme, onOpenCV }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'CV', href: '#cv', action: onOpenCV },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed-top transition-all ${
        scrolled ? 'glass-panel py-2 shadow-lg' : 'bg-transparent py-3'
      }`}
      style={{ zIndex: 1040, transition: 'all 0.3s ease' }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="d-flex align-items-center gap-2 text-decoration-none"
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--gradient-brand)',
              color: '#ffffff'
            }}
          >
            <Code2 size={22} />
          </div>
          <span className="h5 mb-0 fw-bold tracking-tight text-primary">
            Suryakiran<span className="text-gradient">.PJ</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="d-none d-lg-flex align-items-center gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (link.action) {
                  e.preventDefault();
                  link.action();
                }
              }}
              className={`nav-link font-medium transition-colors ${
                activeSection === link.href.substring(1)
                  ? 'text-cyan-400 fw-semibold active-nav-glow'
                  : 'text-secondary'
              }`}
              style={{
                color: activeSection === link.href.substring(1) ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                position: 'relative'
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls (Theme Switcher + Let's Connect CTA + Hamburger) */}
        <div className="d-flex align-items-center gap-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          <a
            href="#contact"
            className="btn btn-brand d-none d-sm-inline-flex"
          >
            <span>Let's Connect</span>
            <ArrowUpRight size={18} />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            className="btn btn-outline-brand p-2 d-lg-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none glass-panel mt-2 py-4 px-4 container rounded-3 shadow-lg"
          style={{ animation: 'fadeIn 0.2s ease-in-out' }}
        >
          <div className="d-flex flex-column gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.action) {
                    e.preventDefault();
                    link.action();
                  }
                }}
                className="py-2 text-decoration-none h6 mb-0 fw-medium"
                style={{
                  color: activeSection === link.href.substring(1) ? 'var(--accent-cyan)' : 'var(--text-primary)'
                }}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-brand w-100 mt-2 justify-content-center"
            >
              Let's Connect
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
