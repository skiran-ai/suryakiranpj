import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ContactForm from './components/ContactForm';
import Chatbot from './components/Chatbot';
import CVViewer from './components/CVViewer';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('suryakiran_portfolio_theme') || 'dark';
  });

  const [isCVOpen, setIsCVOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('suryakiran_portfolio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-vh-100 d-flex flex-column position-relative">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCV={() => setIsCVOpen(true)}
      />

      <main className="flex-grow-1">
        <Hero onOpenCV={() => setIsCVOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <ContactForm />
      </main>

      <Footer />
      <BackToTop />

      <Chatbot onOpenCV={() => setIsCVOpen(true)} />

      <CVViewer
        isOpen={isCVOpen}
        onClose={() => setIsCVOpen(false)}
      />
    </div>
  );
}
