import React from 'react';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function SocialLinks({ className = "", iconSize = 20 }) {
  const links = [
    { name: "GitHub", href: personalInfo.github, icon: Github, color: "#2ea44f" },
    { name: "LinkedIn", href: personalInfo.linkedin, icon: Linkedin, color: "#0a66c2" },
    { name: "Instagram", href: personalInfo.instagram, icon: Instagram, color: "#e4405f" },
    { name: "Email", href: `mailto:${personalInfo.email}`, icon: Mail, color: "#06b6d4" }
  ];

  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      {links.map((link) => {
        const IconComponent = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target={link.name === "Email" ? "_self" : "_blank"}
            rel="noopener noreferrer"
            className="btn btn-outline-brand rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: '42px', height: '42px' }}
            aria-label={link.name}
            title={link.name}
          >
            <IconComponent size={iconSize} />
          </a>
        );
      })}
    </div>
  );
}
