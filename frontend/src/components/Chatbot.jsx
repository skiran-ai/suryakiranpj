import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, FileText } from 'lucide-react';
import { chatbotKnowledgeBase } from '../data/portfolioData';

export default function Chatbot({ onOpenCV }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! 👋 I'm Suryakiran's AI Portfolio Assistant. Ask me anything about his skills, projects, background, contact info, or CV!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    "Who is Suryakiran?",
    "What is his tech stack?",
    "Show Python & Django projects",
    "How can I contact him?",
    "How can I download his CV?"
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    // Special trigger for CV download prompt
    if (textToSend.toLowerCase().includes('cv') || textToSend.toLowerCase().includes('resume')) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: "You can view and download Suryakiran's ATS CV directly!",
            hasCVAction: true
          }
        ]);
      }, 600);
      return;
    }

    try {
      // Query Django API
      const res = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();
      
      setIsTyping(false);
      if (res.ok && data.answer) {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.answer }]);
      } else {
        throw new Error();
      }
    } catch {
      // Client Knowledge Base Fallback
      setTimeout(() => {
        setIsTyping(false);
        const lower = textToSend.toLowerCase();
        let match = chatbotKnowledgeBase.find(item =>
          item.keywords.some(kw => lower.includes(kw))
        );

        const answer = match
          ? match.answer
          : "Suryakiran P. J. is a Python Full Stack Developer proficient in Python, Django, React.js, JavaScript, and Bootstrap 5. Feel free to ask about his skills, projects, or contact details!";

        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: answer }]);
      }, 500);
    }
  };

  return (
    <div className="chatbot-widget">
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-btn"
        aria-label="Toggle portfolio assistant"
        title="Chat with Suryakiran's AI Assistant"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="chatbot-window glass-panel d-flex flex-column shadow-lg">
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
                <h4 className="h6 mb-0 text-primary fw-bold">Suryakiran AI Assistant</h4>
                <span className="small text-emerald-400 d-flex align-items-center gap-1 font-code" style={{ fontSize: '0.7rem' }}>
                  <span className="rounded-circle d-inline-block bg-success" style={{ width: '6px', height: '6px' }}></span>
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-sm text-secondary p-1 border-0"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
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
                  style={{ fontSize: '0.9rem', whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                  {msg.hasCVAction && (
                    <div className="mt-2 pt-2 border-top border-secondary border-opacity-25">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onOpenCV();
                        }}
                        className="btn btn-outline-brand btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                      >
                        <FileText size={16} />
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
              <div className="d-flex gap-2 align-items-center text-muted small">
                <Bot size={16} className="text-cyan-400" />
                <Loader2 size={16} className="animate-spin" />
                <span>Assistant is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggested Chips */}
          <div className="px-3 py-2 border-top border-secondary border-opacity-10 d-flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="btn btn-outline-brand btn-sm py-1 px-2 text-nowrap rounded-pill"
                style={{ fontSize: '0.75rem' }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
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
              placeholder="Ask a question..."
              className="form-control glass-panel border-0 text-primary small py-2 px-3"
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
