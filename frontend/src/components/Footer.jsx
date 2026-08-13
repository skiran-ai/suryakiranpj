import React from 'react';
import { personalInfo } from '../data/portfolioData';
import SocialLinks from './SocialLinks';
import { Code2, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-panel border-top border-secondary border-opacity-25 py-5 position-relative mt-5">
      <div className="container">
        <div className="row gy-4 align-items-center justify-content-between">
          {/* Left Brand info */}
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', background: 'var(--gradient-brand)', color: '#ffffff' }}
              >
                <Code2 size={20} />
              </div>
              <span className="h5 mb-0 fw-bold tracking-tight text-primary">
                Suryakiran<span className="text-gradient">.PJ</span>
              </span>
            </div>
            <p className="small text-secondary mb-0">
              Python Full Stack Developer — Building modern, responsive and scalable web solutions.
            </p>
          </div>

          {/* Right Socials & Copyright */}
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end mb-3">
              <SocialLinks iconSize={18} />
            </div>
            <p className="small text-muted mb-0">
              © {currentYear} Suryakiran P. J. All rights reserved. Crafted with Python, React & Bootstrap 5.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
