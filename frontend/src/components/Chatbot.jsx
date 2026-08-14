import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, FileText, Briefcase, Code, Terminal } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export default function Chatbot({ onOpenCV, activeMode, setActiveMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState(activeMode || 'STANDARD'); // STANDARD, RECRUITER, CLIENT, DEVELOPER
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! 👋 I'm KIRAN AI, Suryakiran's Portfolio Assistant. Select a mode or ask me anything about his skills, projects, or CV!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (activeMode) {
      setCurrentMode(activeMode);
      setIsOpen(true);
      handleSend(`Summarize in ${activeMode} mode`, activeMode);
    }
  }, [activeMode]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText, forceMode) => {
    const modeToUse = forceMode || currentMode;
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    if (textToSend.toLowerCase().includes('cv') || textToSend.toLowerCase().includes('resume')) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: "You can view and download Suryakiran's complete ATS CV directly!",
            hasCVAction: true
          }
        ]);
      }, 500);
      return;
    }

    try {
      const res = await apiClient.queryAIChat(textToSend, modeToUse);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: res.answer, mode: res.mode }
      ]);
    } catch {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "Suryakiran P. J. is a Python Full Stack Developer specializing in Python, Django, DRF, React.js, and modern full-stack web applications."
        }
      ]);
    }
  };

  const modes = [
    { key: 'STANDARD', label: 'General Q&A', icon: Bot },
    { key: 'RECRUITER', label: 'Recruiter Mode', icon: Briefcase },
    { key: 'CLIENT', label: 'Client Mode', icon: Sparkles },
    { key: 'DEVELOPER', label: 'Developer Mode', icon: Code },
  ];

  return (
    <div className="chatbot-widget" style={{ zIndex: 1040 }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-btn shadow-lg"
        aria-label="Toggle Portfolio Assistant"
        title="Chat with KIRAN AI Assistant"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      {/* Drawer Window */}
      {isOpen && (
        <div className="chatbot-window glass-panel d-flex flex-column shadow-2xl border-gradient">
          {/* Header */}
          <div className="p-3 border-bottom border-secondary border-opacity-25 bg-secondary bg-opacity-25 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ background: 'var(--gradient-brand)', color: '#ffffff' }}
              >
                <Bot size={20} />
              </div>
              <div>
                <h4 className="h6 mb-0 text-primary fw-bold font-code">KIRAN AI Assistant</h4>
                <span className="small text-emerald-400 d-flex align-items-center gap-1 font-code" style={{ fontSize: '0.7rem' }}>
                  <span className="rounded-circle d-inline-block bg-success" style={{ width: '6px', height: '6px' }}></span>
                  Grounded Portfolio Intelligence
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-sm text-secondary p-1 border-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="px-3 py-2 bg-dark bg-opacity-40 border-bottom border-secondary border-opacity-10 d-flex gap-1 overflow-x-auto font-code">
            {modes.map((m) => {
              const IconComp = m.icon;
              const isActive = currentMode === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => {
                    setCurrentMode(m.key);
                    handleSend(`Activate ${m.label}`, m.key);
                  }}
                  className={`btn btn-sm py-1 px-2.5 rounded-pill text-nowrap d-flex align-items-center gap-1.5 transition-all ${
                    isActive ? 'btn-brand text-white' : 'btn-outline-brand text-secondary'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                >
                  <IconComp size={12} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Feed */}
          <div className="flex-grow-1 p-3 overflow-y-auto d-flex flex-column gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex gap-2 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div
                    className="rounded-circle p-1.5 flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', background: 'var(--gradient-glow)', color: 'var(--accent-cyan)' }}
                  >
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`p-3 rounded-3 max-w-85 ${
                    msg.sender === 'user'
                      ? 'btn-brand text-white border-0'
                      : 'glass-panel text-primary'
                  }`}
                  style={{ fontSize: '0.88rem', whiteSpace: 'pre-line', lineHeight: '1.5' }}
                >
                  {msg.text}

                  {msg.hasCVAction && (
                    <div className="mt-2 pt-2 border-top border-secondary border-opacity-25">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onOpenCV();
                        }}
                        className="btn btn-outline-brand btn-sm w-100 d-flex align-items-center justify-content-center gap-1 font-code"
                      >
                        <FileText size={15} />
                        <span>Open & Download CV</span>
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div
                    className="rounded-circle p-1.5 flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                  >
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="d-flex gap-2 align-items-center text-muted small font-code">
                <Bot size={16} className="text-cyan-400" />
                <Loader2 size={16} className="animate-spin" />
                <span>KIRAN AI is analyzing knowledge base...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-1.5 border-top border-secondary border-opacity-10 d-flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {[
              "Who is Suryakiran?",
              "What is his tech stack?",
              "Show Full Stack Projects",
              "How to contact him?",
              "Download CV"
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="btn btn-outline-brand btn-sm py-0.5 px-2 text-nowrap rounded-pill font-code"
                style={{ fontSize: '0.72rem' }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-top border-secondary border-opacity-25 d-flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask KIRAN AI (${currentMode} mode)...`}
              className="form-control glass-panel border-0 text-primary small py-2 px-3 focus-none shadow-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn btn-brand p-2 d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
