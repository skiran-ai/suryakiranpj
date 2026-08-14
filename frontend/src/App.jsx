import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ContactForm from './components/ContactForm';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import SystemStatus from './components/SystemStatus';

// Heavy secondary components lazy-loaded for optimal initial bundle performance
const Chatbot = lazy(() => import('./components/Chatbot'));
const CVViewer = lazy(() => import('./components/CVViewer'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

export default function App() {
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
