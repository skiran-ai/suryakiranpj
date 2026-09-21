import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import AntigravityCapabilityMatrix from './AntigravityCapabilityMatrix';
import Projects from './Projects';
import AntigravityTerminal from './AntigravityTerminal';
import AntigravityDossierSection from './AntigravityDossierSection';
import About from './About';
import Skills from './Skills';
import ContactForm from './ContactForm';
import BackToTop from './BackToTop';
import Footer from './Footer';
import SystemStatus from './SystemStatus';

// Heavy secondary components lazy-loaded for optimal initial bundle performance
const Chatbot = lazy(() => import('./Chatbot'));
const CVViewer = lazy(() => import('./CVViewer'));
const CommandPalette = lazy(() => import('./CommandPalette'));

export default function PublicPortfolio() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('suryakiran_portfolio_theme') || 'dark';
  });

  const [isCVOpen, setIsCVOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeAIMode, setActiveAIMode] = useState(null);
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    return localStorage.getItem('suryakiran_reduced_motion') === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('suryakiran_portfolio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleReducedMotion = () => {
    setIsReducedMotion(prev => {
      const next = !prev;
      localStorage.setItem('suryakiran_reduced_motion', String(next));
      return next;
    });
  };

  const handleOpenAIWithMode = (mode) => {
    setActiveAIMode(mode);
  };

  return (
    <div className="min-vh-100 d-flex flex-column position-relative" style={{ background: '#08080c', color: '#e4e1e8' }}>
      {/* 2027 Antigravity HUD Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCV={() => setIsCVOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAIWithMode={handleOpenAIWithMode}
      />

      {/* Main Page Layout */}
      <main className="flex-grow-1">
        {/* Section 1: Hero / Holographic Quantum Spherical HUD */}
        <Hero
          onOpenCV={() => setIsCVOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          isReducedMotion={isReducedMotion}
        />

        {/* Section 2: Python Full Stack Capability Matrix (Bento Grid) */}
        <AntigravityCapabilityMatrix />

        {/* Section 3: Flagship Autonomous Systems & Architecture X-Ray */}
        <Projects />

        {/* Section 4: Real-Time Interactive CLI Simulator */}
        <AntigravityTerminal />

        {/* Section 5: Antigravity Architectural Dossier & Whitepaper Portal */}
        <AntigravityDossierSection />

        {/* Engineering Background & Deep Knowledge Base */}
        <About />
        <Skills />

        {/* Secure Contact & Email Dispatch Link */}
        <ContactForm />
      </main>

      {/* Cybernetic HUD Footer */}
      <Footer />
      <BackToTop />
      <SystemStatus />

      {/* Grounded AI Assistant Drawer */}
      <Suspense fallback={null}>
        <Chatbot
          onOpenCV={() => setIsCVOpen(true)}
          activeMode={activeAIMode}
          setActiveMode={setActiveAIMode}
        />
      </Suspense>

      {/* ATS CV Viewer Modal */}
      {isCVOpen && (
        <Suspense fallback={null}>
          <CVViewer
            isOpen={isCVOpen}
            onClose={() => setIsCVOpen(false)}
          />
        </Suspense>
      )}

      {/* Keyboard Command Palette (Ctrl + K) */}
      <Suspense fallback={null}>
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={setIsCommandPaletteOpen}
          onOpenCV={() => setIsCVOpen(true)}
          onOpenAIWithMode={handleOpenAIWithMode}
          toggleTheme={toggleTheme}
          theme={theme}
          isReducedMotion={isReducedMotion}
          toggleReducedMotion={toggleReducedMotion}
        />
      </Suspense>
    </div>
  );
}
