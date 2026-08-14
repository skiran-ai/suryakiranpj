import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
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
    <div className="min-vh-100 d-flex flex-column position-relative">
      {/* Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCV={() => setIsCVOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAIWithMode={handleOpenAIWithMode}
      />

      {/* Main Page Layout */}
      <main className="flex-grow-1">
        <Hero
          onOpenCV={() => setIsCVOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          isReducedMotion={isReducedMotion}
        />
        <About />
        <Skills />
        <Projects />
        <ContactForm />
      </main>

      {/* Footer & Floating Widgets */}
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
