import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-brand rounded-circle p-2 d-flex align-items-center justify-content-center"
      style={{ width: '42px', height: '42px' }}
      aria-label="Toggle dark/light theme"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-warning" />
      ) : (
        <Moon size={20} className="text-primary" />
      )}
    </button>
  );
}
