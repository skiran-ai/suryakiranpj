import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="btn btn-outline-brand rounded-circle p-2 position-fixed shadow-lg d-flex align-items-center justify-content-center transition-all"
      style={{
        bottom: '24px',
        left: '24px',
        width: '46px',
        height: '46px',
        zIndex: 1040
      }}
      aria-label="Scroll back to top"
      title="Back to top"
    >
      <ArrowUp size={22} />
    </button>
  );
}
