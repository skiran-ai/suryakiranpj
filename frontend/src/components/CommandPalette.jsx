import React, { useState, useEffect } from 'react';
import { Search, Command, FileText, Bot, Sun, Moon, Github, Linkedin, Mail, Sparkles, X, EyeOff } from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenCV,
  onOpenAIWithMode,
  toggleTheme,
  theme,
  isReducedMotion,
  toggleReducedMotion
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'ask-ai-recruiter',
      title: 'Ask AI: Recruiter Mode',
      subtitle: 'Summarize core skills, experience, and CV highlights',
      icon: Bot,
      action: () => { onClose(false); onOpenAIWithMode('RECRUITER'); }
    },
    {
      id: 'ask-ai-client',
      title: 'Ask AI: Client Mode',
      subtitle: 'Consult on building custom full-stack web applications',
      icon: Sparkles,
      action: () => { onClose(false); onOpenAIWithMode('CLIENT'); }
    },
    {
      id: 'ask-ai-dev',
      title: 'Ask AI: Developer Mode',
      subtitle: 'Technical breakdown of system architectures & stack',
      icon: Command,
      action: () => { onClose(false); onOpenAIWithMode('DEVELOPER'); }
    },
    {
      id: 'open-cv',
      title: 'View & Download CV',
      subtitle: 'Open ATS-friendly resume modal viewer',
      icon: FileText,
      action: () => { onClose(false); onOpenCV(); }
    },
    {
      id: 'toggle-theme',
      title: `Toggle Theme (Current: ${theme.toUpperCase()})`,
      subtitle: 'Switch between dark and light glassmorphism themes',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => { toggleTheme(); }
    },
    {
      id: 'toggle-motion',
      title: `Toggle Reduced Motion (${isReducedMotion ? 'ON' : 'OFF'})`,
      subtitle: 'Enable or disable 3D canvas and scroll animations',
      icon: EyeOff,
      action: () => { toggleReducedMotion(); }
    },
    {
      id: 'nav-github',
      title: 'GitHub Profile',
      subtitle: 'Visit github.com/skiran-ai',
      icon: Github,
      action: () => window.open('https://github.com/skiran-ai', '_blank')
    },
    {
      id: 'nav-linkedin',
      title: 'LinkedIn Profile',
      subtitle: 'Visit linkedin.com/in/surya-kiran-967659351',
      icon: Linkedin,
      action: () => window.open('https://www.linkedin.com/in/surya-kiran-967659351', '_blank')
    },
    {
      id: 'contact-me',
      title: 'Contact Suryakiran',
      subtitle: 'Scroll to contact section or send message',
      icon: Mail,
      action: () => {
        onClose(false);
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-start justify-content-center pt-5 px-3"
      onClick={() => onClose(false)}
      style={{ zIndex: 1200 }}
    >
      <div
        className="glass-card max-w-600 w-100 p-0 overflow-hidden shadow-2xl border-gradient"
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: '5vh' }}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-3">
          <Search size={20} className="text-cyan-400 ms-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search... (Press ESC to close)"
            className="form-control glass-panel border-0 text-primary py-2 px-3 focus-none shadow-none"
            autoFocus
          />
          <button
            onClick={() => onClose(false)}
            className="btn btn-sm text-secondary p-1 border-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Command Options List */}
        <div className="p-2 max-h-400 overflow-y-auto font-code">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No matching commands found for "{query}".
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const IconComp = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  className="p-3 rounded-3 d-flex align-items-center justify-content-between cursor-pointer transition-all hover-glow border-bottom border-secondary border-opacity-10"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{ background: 'var(--gradient-glow)', color: 'var(--accent-cyan)' }}
                    >
                      <IconComp size={18} />
                    </div>
                    <div>
                      <div className="fw-semibold text-primary">{cmd.title}</div>
                      <div className="small text-secondary font-sans">{cmd.subtitle}</div>
                    </div>
                  </div>
                  <Command size={14} className="text-secondary opacity-50" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-3 py-2 bg-secondary bg-opacity-10 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center text-muted small font-code" style={{ fontSize: '0.75rem' }}>
          <span>Navigation Shortcut</span>
          <span>Press <kbd className="bg-dark text-white px-1.5 py-0.5 rounded">Ctrl</kbd> + <kbd className="bg-dark text-white px-1.5 py-0.5 rounded">K</kbd> anytime</span>
        </div>
      </div>
    </div>
  );
}
