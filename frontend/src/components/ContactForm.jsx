import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Sparkles, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import SocialLinks from './SocialLinks';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    message: null
  });

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('suryakiranpjineesh@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleDirectEmailApp = (e) => {
    e.preventDefault();
    const subjectEncoded = encodeURIComponent(formData.subject || `Inquiry from ${formData.name || 'Portfolio Visitor'}`);
    const bodyEncoded = encodeURIComponent(
      `Name: ${formData.name || 'N/A'}\nEmail: ${formData.email || 'N/A'}\n\nMessage:\n${formData.message || ''}`
    );
    window.location.href = `mailto:suryakiranpjineesh@gmail.com?subject=${subjectEncoded}&body=${bodyEncoded}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        submitting: false,
        success: false,
        error: 'Please fill in all required fields (Name, Email, Message).',
        message: null
      });
      return;
    }

    setStatus({ submitting: true, success: false, error: null, message: null });

    const res = await apiClient.submitContact(formData);

    if (res.success) {
      setStatus({
        submitting: false,
        success: true,
        error: null,
        message: res.message || "Thank you! Your message has been sent successfully."
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus({
        submitting: false,
        success: false,
        error: res.message || 'Failed to submit contact message. Please try again or email directly.',
        message: null
      });
    }
  };

  return (
    <section id="contact" className="section-padding position-relative">
      <div className="container">
        {/* Section Heading */}
        <div className="text-center mb-4 mb-md-5">
          <div className="badge-brand mb-2">
            <Sparkles size={16} />
            <span>Get In Touch</span>
          </div>
          <h2 className="display-5 section-title">
            Let's Build Something <span className="text-gradient">Together</span>
          </h2>
          <p className="section-subtitle">
            Have a project opportunity, career inquiry, or full-stack software project? Send Suryakiran a direct message below.
          </p>
        </div>

        <div className="row gy-4 align-items-stretch">
          {/* Contact Details Left Column */}
          <div className="col-lg-5">
            <div className="glass-card p-3 p-sm-4 p-lg-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <h3 className="h4 text-primary fw-bold mb-3">Direct Contact Channels</h3>
                <p className="text-secondary mb-4 small" style={{ lineHeight: '1.6' }}>
                  Feel free to reach out via email, inspect code repositories on GitHub, or connect on LinkedIn and Instagram.
                </p>

                {/* Email Channel Card with Copy & Direct Mailto */}
                <div className="glass-panel p-3 mb-3 d-flex flex-column gap-2">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
                      <div
                        className="rounded-circle p-2.5 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ background: 'var(--gradient-glow)', color: 'var(--accent-cyan)' }}
                      >
                        <Mail size={22} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <span className="small text-muted d-block font-code" style={{ fontSize: '0.72rem' }}>EMAIL ADDRESS</span>
                        <a
                          href="mailto:suryakiranpjineesh@gmail.com"
                          className="text-primary fw-semibold text-decoration-none contact-email-link"
                          style={{ fontSize: '0.92rem' }}
                        >
                          suryakiranpjineesh@gmail.com
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      type="button"
                      className="btn btn-sm btn-outline-brand p-1.5 rounded-circle flex-shrink-0 ms-2"
                      title="Copy email to clipboard"
                      aria-label="Copy email address"
                    >
                      {copiedEmail ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                  {copiedEmail && (
                    <div className="text-emerald-400 font-code small text-end pt-1" style={{ fontSize: '0.75rem' }}>
                      ✓ Email address copied to clipboard!
                    </div>
                  )}
                </div>

                {/* Location Box */}
                <div className="glass-panel p-3 mb-4 d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle p-2.5 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ background: 'var(--gradient-glow)', color: 'var(--accent-purple)' }}
                  >
                    <MapPin size={22} />
                  </div>
                  <div>
                    <span className="small text-muted d-block font-code" style={{ fontSize: '0.72rem' }}>LOCATION</span>
                    <span className="text-primary fw-semibold" style={{ fontSize: '0.92rem' }}>Kerala, India</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="h6 text-primary fw-bold mb-3 font-code">Connect & Follow:</h4>
                <SocialLinks iconSize={20} />
              </div>
            </div>
          </div>

          {/* Contact Form Right Column */}
          <div className="col-lg-7">
            <div className="glass-card p-3 p-sm-4 p-lg-5 h-100 d-flex flex-column justify-content-between">
              <div>
                {status.success && (
                  <div className="alert alert-success d-flex align-items-center gap-2 mb-4 font-code" role="alert">
                    <CheckCircle2 size={20} className="flex-shrink-0" />
                    <div>{status.message}</div>
                  </div>
                )}

                {status.error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 font-code" role="alert">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <div>{status.error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row gy-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label text-secondary small fw-semibold font-code">
                        Your Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Smith"
                        className="form-control glass-panel text-primary border-0 p-3"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label text-secondary small fw-semibold font-code">
                        Your Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. alex@example.com"
                        className="form-control glass-panel text-primary border-0 p-3"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="subject" className="form-label text-secondary small fw-semibold font-code">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Full Stack Project Inquiry"
                        className="form-control glass-panel text-primary border-0 p-3"
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="message" className="form-label text-secondary small fw-semibold font-code">
                        Message <span className="text-danger">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message details here..."
                        className="form-control glass-panel text-primary border-0 p-3"
                        required
                      ></textarea>
                    </div>

                    <div className="col-12 pt-2">
                      <button
                        type="submit"
                        disabled={status.submitting}
                        className="btn btn-brand w-100 py-3 justify-content-center font-code shadow-lg"
                      >
                        {status.submitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin me-2" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} className="me-2" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Direct Mail Client Trigger Alternative */}
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 text-center">
                <button
                  type="button"
                  onClick={handleDirectEmailApp}
                  className="btn btn-link text-decoration-none text-secondary small font-code hover-cyan p-0 d-inline-flex align-items-center gap-1"
                  style={{ fontSize: '0.8rem' }}
                >
                  <span>Prefer your default mail app? Click here to open Gmail / Mail directly</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
